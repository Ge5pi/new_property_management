import { useCallback } from 'react';
import { Col, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import { IVendor } from 'interfaces/IPeoples';
import { IUtilityBills } from 'interfaces/IProperties';

interface IProps {
  createUtilityBill: GenericMutationTrigger<IUtilityBills, IUtilityBills>;
  property_id: string | number;
}

const UtilityBillSchema = Yup.object().shape({
  utility: Yup.string().trim().required('This field is required!'),
  vendor: yupFilterInput.required('This field is required!'),
  owner_contribution_percentage: Yup.number()
    .min(0, 'Please enter a positive number')
    .required('This field is required!'),
  tenant_contribution_percentage: Yup.number()
    .min(0, 'Please enter a positive number')
    .required('This field is required!'),
});

const UtilityBillsModal = ({ createUtilityBill, property_id }: IProps) => {
  const handleFormSubmission = async (values: FormikValues) => {
    const vendor = (values.vendor as Array<IVendor>)[0];
    const vendor_id = Number(vendor.id);
    const data = {
      ...values,
      vendor: vendor_id,
      vendor_bill_gl: vendor.gl_account,
      tenant_charge_gl: '15454589 98598956 6566',
      parent_property: Number(property_id),
    };

    if (createUtilityBill) {
      return await createUtilityBill(data as IUtilityBills);
    }

    return Promise.reject('Incomplete information provided!');
  };

  const formik = useFormik({
    initialValues: {
      utility: '',
      vendor: [] as Option[],
      owner_contribution_percentage: '',
      tenant_contribution_percentage: '',
    },
    validationSchema: UtilityBillSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            SwalExtended.close();
          } else {
            const error = result.error as BaseQueryError;
            if (error.status === 400 && error.data) {
              renderFormError(error.data, setFieldError);
            }
          }
        })
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong, please check your input record',
            description: getReadableError(error),
          });
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    handleReset,
    errors,
  } = formik;

  const onVendorNameSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('vendor', selected);
      } else {
        setFieldValue('vendor', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Popup
      title={'Add new utility bill'}
      subtitle={'Save the property utility bills'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <CustomSelect
        labelText="Select Utility"
        controlId={`UtilityBillsFormSelectUtility`}
        placeholder={`Select`}
        options={[
          { label: 'Electricity', value: 'Electricity' },
          { label: 'Gas', value: 'Gas' },
          { label: 'Water', value: 'Water' },
          { label: 'Telephone', value: 'Telephone' },
          { label: 'Maintenance', value: 'Maintenance' },
        ]}
        classNames={{
          labelClass: 'popup-form-labels',
          wrapperClass: 'mx-sm-2 mx-0 mb-4',
        }}
        name="utility"
        value={values.utility}
        onSelectChange={value => setFieldValue('utility', value)}
        onBlurChange={() => setFieldTouched('utility', true)}
        isValid={touched.utility && !errors.utility}
        isInvalid={touched.utility && !!errors.utility}
        error={errors.utility}
      />

      <FilterPaginateInput
        name="vendor"
        labelText="Vendor"
        controlId={`UtilityBillsFormSelectVendor`}
        placeholder={`Choose Vendor`}
        classNames={{
          labelClass: 'popup-form-labels',
          wrapperClass: 'mx-sm-2 mx-0 mb-4',
        }}
        selected={values.vendor}
        onSelectChange={onVendorNameSelected}
        onBlurChange={() => setFieldTouched('vendor', true)}
        isValid={touched.vendor && !errors.vendor}
        isInvalid={touched.vendor && !!errors.vendor}
        model_label="people.Vendor"
        filterBy={['first_name', 'last_name']}
        inputProps={{
          style: {
            paddingLeft: values.vendor.length > 0 ? `2.5rem` : '',
          },
        }}
        labelKey={option => getStringPersonName(option as IVendor)}
        renderMenuItemChildren={option => <ItemMenuItem option={option as IVendor} />}
        renderInput={(inputProps, { selected }) => {
          const option = selected.length > 0 ? (selected[0] as IVendor) : undefined;
          return <ItemInputItem {...inputProps} option={option} />;
        }}
        error={errors.vendor}
      />

      <p className="text-primary small">
        Vendor GL account : {values.vendor && values.vendor.length > 0 ? (values.vendor[0] as IVendor).gl_account : ''}
      </p>
      <p className="text-primary small">Tenant GL account : </p>

      <Row className="mt-4 gx-0">
        <Col lg={5} sm={6}>
          <GroupedField
            wrapperClass="mx-sm-2 mx-0 mb-4"
            labelClass="popup-form-labels"
            controlId="UtilityBillsFormOwnerContribution"
            icon={'%'}
            position="end"
            min="0"
            type="number"
            step={0.1}
            label="Owner Contribution"
            placeholder="50"
            name="owner_contribution_percentage"
            value={values.owner_contribution_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.owner_contribution_percentage && !errors.owner_contribution_percentage}
            isInvalid={touched.owner_contribution_percentage && !!errors.owner_contribution_percentage}
            error={errors.owner_contribution_percentage}
          />
        </Col>
        <Col lg={5} sm={6}>
          <GroupedField
            wrapperClass="mx-sm-2 mx-0 mb-4"
            labelClass="popup-form-labels"
            controlId="UtilityBillsFormTenantContribution"
            icon={'%'}
            position="end"
            min="0"
            type="number"
            step={0.1}
            label="Tenant Contribution"
            placeholder="50"
            name="tenant_contribution_percentage"
            value={values.tenant_contribution_percentage}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.tenant_contribution_percentage && !errors.tenant_contribution_percentage}
            isInvalid={touched.tenant_contribution_percentage && !!errors.tenant_contribution_percentage}
            error={errors.tenant_contribution_percentage}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default UtilityBillsModal;
