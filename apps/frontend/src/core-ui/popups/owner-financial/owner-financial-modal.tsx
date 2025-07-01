import { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetOwnersByIdQuery } from 'services/api/owners';
import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getIDFromObject, getStringPersonName, renderFormError } from 'utils/functions';

import { PaymentType } from 'interfaces/IAssets';
import { IOwner, ISinglePeopleOwner } from 'interfaces/IPeoples';
import { IPropertyOwner } from 'interfaces/IProperties';

interface IProps {
  owner?: IPropertyOwner;
  update?: boolean;
  property: string | number;
  maxPercentage?: number;
  createPropertyOwner?: GenericMutationTrigger<IPropertyOwner, IPropertyOwner>;
  updatePropertyOwner?: GenericMutationTrigger<Partial<IPropertyOwner>, IPropertyOwner>;
}

const OwnerFinancialSchema = Yup.object().shape({
  ownership_start_date: Yup.date().required('This field is required!'),
  owner: yupFilterInput.required('this filed is required!'),
  max_percentage: Yup.number().required('This field is required!'),
  percentage_owned: Yup.number()
    .positive()
    .required('This field is required!')
    .max(Yup.ref('max_percentage'))
    .min(1)
    .label('percentage'),
  contract_expiry: Yup.date()
    .when('ownership_start_date', (start_time: Date[], schema) => {
      const date = start_time && start_time.length > 0 && start_time[0];
      if (date) {
        const currentDay = new Date(date.getTime());
        return schema.min(currentDay, 'Expiry must be after start date');
      } else {
        return schema;
      }
    })
    .required('This field is required!'),
  payment_type: Yup.string().required('This field is required!'),
  reserve_funds: Yup.number().required('This field is required!'),
  fiscal_year_end: Yup.string().required('This field is required!'),
});

const OwnerFinancialModal = ({
  createPropertyOwner,
  owner,
  update,
  property,
  maxPercentage = 100,
  updatePropertyOwner,
}: IProps) => {
  const {
    data: owners,
    isLoading: ownersLoading,
    isFetching: ownersFetching,
  } = useGetOwnersByIdQuery(getIDFromObject('owner', owner));

  const formik = useFormik({
    initialValues: {
      ownership_start_date: owner?.ownership_start_date ?? '',
      owner: owners ? [owners] : ([] as Option[]),
      percentage_owned: owner?.percentage_owned ?? '',
      max_percentage: maxPercentage,
      contract_expiry: owner?.contract_expiry ?? '',
      payment_type: owner?.payment_type ?? ('flat' as PaymentType),
      reserve_funds: owner?.reserve_funds ?? '',
      fiscal_year_end: owner?.fiscal_year_end ?? '',
    },
    validationSchema: OwnerFinancialSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      if (property && Number(property) > 0) {
        let owner_id = 0;
        if (values.owner && values.owner.length > 0) {
          owner_id = Number((values.owner as Array<ISinglePeopleOwner>)[0].id);
        }

        const data: IPropertyOwner = {
          ...values,
          owner: owner_id,
          parent_property: Number(property),
          reserve_funds: Number(values.reserve_funds),
          percentage_owned: Number(values.percentage_owned),
        };

        if (update && owner && Number(owner.id) > 0) {
          updatePropertyOwner &&
            updatePropertyOwner({ ...data, id: owner.id })
              .then(result => {
                if (result.data) {
                  SwalExtended.close();
                } else {
                  const error = result.error as BaseQueryError;
                  if (error.status === 400 && error.data) {
                    renderFormError(error.data, setFieldError);
                    if ('non_field_errors' in error.data) {
                      Notify.show({
                        type: 'danger',
                        title: 'Owner already exist with given name',
                      });
                    }
                  }
                }
              })
              .finally(() => {
                setSubmitting(false);
                SwalExtended.hideLoading();
              });
        } else {
          createPropertyOwner &&
            createPropertyOwner(data)
              .then(result => {
                if (result.data) {
                  SwalExtended.close();
                } else {
                  const error = result.error as BaseQueryError;
                  if (error.status === 400 && error.data) {
                    renderFormError(error.data, setFieldError);
                    if ('non_field_errors' in error.data) {
                      Notify.show({
                        type: 'danger',
                        title: 'Owner already exist with given name',
                      });
                    }
                  }
                }
              })
              .finally(() => {
                setSubmitting(false);
                SwalExtended.hideLoading();
              });
        }
      } else {
        Notify.show({
          type: 'danger',
          title: 'Invalid Property ID provided',
        });
        setSubmitting(false);
        SwalExtended.hideLoading();
      }
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    isSubmitting,
    setFieldValue,
    setFieldTouched,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  const onOwnerSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('owner', selected);
      } else {
        setFieldValue('owner', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Popup
      title={'Add new ownership'}
      subtitle={'Include a new owner to this property'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gx-sm-4 gx-0">
        <Col md={4} sm={6}>
          <InputDate
            name={'ownership_start_date'}
            labelText={'Ownership start date'}
            controlId="OwnershipFormStartDate"
            classNames={{ wrapperClass: 'mx-sm-0 mx-0 mb-4', labelClass: 'popup-form-labels' }}
            onDateSelection={date => setFieldValue('ownership_start_date', date)}
            value={values.ownership_start_date}
            isValid={touched.ownership_start_date && !errors.ownership_start_date}
            isInvalid={touched.ownership_start_date && !!errors.ownership_start_date}
            error={errors.ownership_start_date}
            onBlur={handleBlur}
          />
        </Col>

        <Col md={4} sm={6}>
          <FilterPaginateInput
            name="owner"
            labelText="Select Owner"
            controlId={`OwnershipFormSelectOwner`}
            placeholder={`Owner Name`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
            selected={values.owner}
            onSelectChange={onOwnerSelected}
            onBlurChange={() => setFieldTouched('owner', true)}
            isValid={touched.owner && !errors.owner}
            isInvalid={touched.owner && !!errors.owner}
            searchIcon={false}
            model_label="people.Owner"
            filterBy={['first_name', 'last_name']}
            inputProps={{
              style: {
                paddingLeft: values.owner.length > 0 ? `2.5rem` : '',
              },
            }}
            labelKey={option => getStringPersonName(option as IOwner)}
            renderMenuItemChildren={option => <ItemMenuItem option={option as IOwner} />}
            renderInput={(inputProps, { selected }) => {
              const option = selected.length > 0 ? (selected[0] as IOwner) : undefined;
              return <ItemInputItem {...inputProps} option={option} />;
            }}
            disabled={ownersLoading || ownersFetching}
            error={errors.owner}
          />
        </Col>

        <Col md={4} sm={6}>
          <GroupedField
            wrapperClass="mx-sm-0 mx-0 mb-4"
            labelClass="popup-form-labels"
            controlId="OwnershipFormPercentOwned"
            icon={'%'}
            position="end"
            min="0"
            max={values.max_percentage}
            type="number"
            step={0.1}
            label="Percent owned"
            placeholder="50"
            name="percentage_owned"
            value={values.percentage_owned}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.percentage_owned && !errors.percentage_owned}
            isInvalid={touched.percentage_owned && !!errors.percentage_owned}
            error={errors.percentage_owned}
          />
        </Col>

        <Col md={4} sm={6}>
          <InputDate
            name={'contract_expiry'}
            labelText={'Contract expiry date'}
            controlId="OwnershipFormExpiryDate"
            classNames={{ wrapperClass: 'mx-sm-0 mx-0 mb-4', labelClass: 'popup-form-labels' }}
            onDateSelection={date => setFieldValue('contract_expiry', date)}
            value={values.contract_expiry}
            minDate={new Date(values.ownership_start_date)}
            onBlur={handleBlur}
            isValid={touched.contract_expiry && !errors.contract_expiry}
            isInvalid={touched.contract_expiry && !!errors.contract_expiry}
            error={errors.contract_expiry}
          />
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col sm>
          <CustomSelect
            labelText="Payment Type"
            controlId="OwnershipFormPaymentType"
            defaultValue={'Net Income'}
            options={[
              { label: 'Net Income', value: 'net_income' },
              { label: 'Flat', value: 'flat' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
            name="payment_type"
            value={values.payment_type}
            onSelectChange={value => setFieldValue('payment_type', value)}
            onBlurChange={() => setFieldTouched('payment_type', true)}
            isValid={touched.payment_type && !errors.payment_type}
            isInvalid={touched.payment_type && !!errors.payment_type}
            error={errors.payment_type}
          />
        </Col>
        <Col sm>
          <GroupedField
            wrapperClass="mx-sm-0 mx-0 mb-4"
            labelClass="popup-form-labels"
            controlId="OwnershipFormReserves"
            icon={'$'}
            position="end"
            min="0"
            type="number"
            step={0.1}
            label="Reserve Funds"
            placeholder="50"
            name="reserve_funds"
            value={values.reserve_funds}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.reserve_funds && !errors.reserve_funds}
            isInvalid={touched.reserve_funds && !!errors.reserve_funds}
            error={errors.reserve_funds}
          />
        </Col>
        <Col sm>
          <CustomSelect
            labelText="Fiscal Year end"
            controlId="OwnershipFormYearEnd"
            defaultValue={'January'}
            options={[
              { label: 'January', value: 'january' },
              { label: 'February', value: 'february' },
              { label: 'March', value: 'march' },
              { label: 'April', value: 'april' },
              { label: 'May', value: 'may' },
              { label: 'June', value: 'june' },
              { label: 'July', value: 'july' },
              { label: 'August', value: 'august' },
              { label: 'September', value: 'september' },
              { label: 'October', value: 'october' },
              { label: 'November', value: 'november' },
              { label: 'December', value: 'december' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mx-sm-0 mx-0 mb-4',
            }}
            name="fiscal_year_end"
            value={values.fiscal_year_end}
            onSelectChange={value => setFieldValue('fiscal_year_end', value)}
            onBlurChange={() => setFieldTouched('fiscal_year_end', true)}
            isValid={touched.fiscal_year_end && !errors.fiscal_year_end}
            isInvalid={touched.fiscal_year_end && !!errors.fiscal_year_end}
            error={errors.fiscal_year_end}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(OwnerFinancialModal);
