import { Fragment, useCallback } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import useResponse from 'services/api/hooks/useResponse';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useCreateRentableItemMutation, useUpdateRentableItemMutation } from 'services/api/rentable';
import { useGetTenantByIdQuery } from 'services/api/tenants';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { UsersPlusIcon } from 'core-ui/icons';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useWindowSize } from 'hooks/useWindowSize';

import { getIDFromObject, getSearchFilter, getStringPersonName, getValidID, renderFormError } from 'utils/functions';

import { IPropertyAPI } from 'interfaces/IProperties';
import { IRentableItems } from 'interfaces/IRentableItems';
import { ISingleTenant, ITenantAPI } from 'interfaces/ITenant';

interface IProps {
  items?: IRentableItems;
  update?: boolean;
  property_id?: string | number;
}
const RentableSchema = Yup.object().shape({
  tenant: yupFilterInput.required('this filed is required!'),
  property_name: yupFilterInput.required('this filed is required!'),
  name: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().required('This field is required!').min(5),
  amount: Yup.number().required('This field is required!'),
  gl_account: Yup.number().required('This field is required!'),
  status: Yup.boolean().required('this field is required!').default(false),
});

const RentalItemModal = ({ items, property_id, update }: IProps) => {
  const [width] = useWindowSize();
  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getValidID(property_id));

  const [
    createRentableItems,
    { isSuccess: isCreateRentableItemSuccess, isError: isCreateRentableItemError, error: createRentableItemError },
  ] = useCreateRentableItemMutation();

  useResponse({
    isSuccess: isCreateRentableItemSuccess,
    successTitle: 'A new rentable item has been added!',
    isError: isCreateRentableItemError,
    error: createRentableItemError,
  });

  // update property
  const [
    updateRentableItems,
    { isSuccess: isUpdateRentableItemSuccess, isError: isUpdateRentableItemError, error: updateRentableItemError },
  ] = useUpdateRentableItemMutation();

  useResponse({
    isSuccess: isUpdateRentableItemSuccess,
    successTitle: 'Item details has been successfully updated!',
    isError: isUpdateRentableItemError,
    error: updateRentableItemError,
  });

  const {
    data: tenant_data,
    isLoading: tenantLoading,
    isFetching: tenantFetching,
  } = useGetTenantByIdQuery(getIDFromObject('tenant', items));

  const formik = useFormik({
    initialValues: {
      property_name: property_data ? [property_data] : ([] as Option[]),
      name: items?.name ?? '',
      description: items?.description ?? '',
      amount: items?.amount ?? '',
      gl_account: items?.gl_account ?? '',
      tenant: tenant_data ? [tenant_data] : ([] as Option[]),
      status: items?.status ?? false,
    },
    validationSchema: RentableSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();
      const tenant_id = values.tenant.length > 0 && Number((values.tenant as Array<ISingleTenant>)[0].id);
      if (tenant_id && tenant_id > 0) {
        if (update && items && Number(items.id) > 0 && Number(property_id) > 0) {
          const data: Partial<IRentableItems> = {
            ...values,
            tenant: tenant_id,
            amount: Number(values.amount),
          };
          updateRentableItems &&
            updateRentableItems({ ...data, parent_property: Number(property_id), id: items.id })
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
              .finally(() => {
                setSubmitting(false);
                SwalExtended.hideLoading();
              });
        } else {
          const property = (values.property_name as Array<IPropertyAPI>)[0].id;
          if (property && property > 0) {
            const data: IRentableItems = {
              ...values,
              tenant: tenant_id,
              amount: Number(values.amount),
              parent_property: Number(property),
            };

            createRentableItems &&
              createRentableItems(data)
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
                .finally(() => {
                  setSubmitting(false);
                  SwalExtended.hideLoading();
                });
          }
        }
      } else {
        Notify.show({
          type: 'danger',
          title: 'Invalid Tenant Information provided, please select a valid unit',
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
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    handleReset,
    handleBlur,
    errors,
  } = formik;

  const onTenantNameSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('tenant', selected);
      } else {
        setFieldValue('tenant', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Popup
      title={`${update ? 'Update' : 'New'} Rentable Item`}
      subtitle={'Add some details of a rentable item'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
    >
      <Row className="gx-lg-4 gx-sm-3 gx-1 gy-2">
        <Col md>
          <Form.Group className="mb-3 me-md-4" controlId="RentableFormItemName">
            <Form.Label className="popup-form-labels">Rentable Item Name</Form.Label>
            <Form.Control
              type="text"
              placeholder="Item name here"
              name="name"
              autoFocus
              value={values.name}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.name && !errors.name}
              isInvalid={touched.name && !!errors.name}
            />
            <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
          </Form.Group>

          <GroupedField
            wrapperClass="mb-3 me-md-4"
            labelClass="popup-form-labels"
            controlId="RentableFormAmount"
            icon={'$'}
            position="end"
            min="0"
            type="number"
            step={0.1}
            label="Amount"
            placeholder="50"
            name="amount"
            value={values.amount}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.amount && !errors.amount}
            isInvalid={touched.amount && !!errors.amount}
            error={errors.amount}
          />

          <CustomSelect
            labelText="GL Account"
            controlId="RentableFormGLAccount"
            options={[
              {
                label: '15454589 98598956 6566',
                value: '15454589 98598956 6566',
              },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3 me-md-4',
            }}
            name="gl_account"
            value={values.gl_account}
            onSelectChange={value => setFieldValue('gl_account', value)}
            onBlurChange={() => setFieldTouched('gl_account', true)}
            isValid={touched.gl_account && !errors.gl_account}
            isInvalid={touched.gl_account && !!errors.gl_account}
            error={errors.gl_account}
          />

          <Form.Group className="mb-3 me-md-4" controlId="RentableFormDescription">
            <Form.Label className="popup-form-labels">Description</Form.Label>
            <Form.Control
              placeholder="Some description here"
              as="textarea"
              rows={5}
              name="description"
              value={values.description}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.description && !errors.description}
              isInvalid={touched.description && !!errors.description}
            />
            <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
          </Form.Group>
        </Col>

        <Col className={clsx({ 'border-start': width > 600 })}>
          <FilterPaginateInput
            name="property_name"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`RentableItemsFormProperty`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3 ms-md-4',
            }}
            selected={values.property_name}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('property_name', selected);
              } else {
                setFieldValue('property_name', []);
              }
            }}
            onBlurChange={() => setFieldTouched('property_name', true)}
            isValid={touched.property_name && !errors.property_name}
            isInvalid={touched.property_name && !!errors.property_name}
            labelKey={'name'}
            disabled={propertyLoading || propertyFetching || Number(property_id) > 0}
            error={errors.property_name}
          />

          <FilterPaginateInput
            name="tenant"
            labelText={
              <Fragment>
                Tenant <UsersPlusIcon />
              </Fragment>
            }
            controlId="RentableFormFormTenant"
            placeholder={`Tenant Name`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3 ms-md-4',
            }}
            selected={values.tenant}
            filter={getSearchFilter(values.property_name, 'lease__unit__parent_property')}
            preload={getSearchFilter(values.property_name, 'lease__unit__parent_property', true)}
            onSelectChange={onTenantNameSelected}
            onBlurChange={() => setFieldTouched('tenant', true)}
            isValid={touched.tenant && !errors.tenant}
            isInvalid={touched.tenant && !!errors.tenant}
            searchIcon={false}
            model_label="people.Tenant"
            filterBy={['first_name', 'last_name']}
            inputProps={{
              style: {
                paddingLeft: values.tenant.length > 0 ? `2.5rem` : '',
              },
            }}
            labelKey={option => getStringPersonName(option as ITenantAPI)}
            renderMenuItemChildren={option => <ItemMenuItem option={option as ITenantAPI} />}
            renderInput={(inputProps, { selected }) => {
              const option = selected.length > 0 ? (selected[0] as ITenantAPI) : undefined;
              return <ItemInputItem {...inputProps} option={option} />;
            }}
            disabled={values.property_name.length <= 0 || tenantLoading || tenantFetching}
            error={errors.tenant}
          />

          <Form.Group className="mb-3 ms-md-4" controlId="RentableFormStatus">
            <Form.Label className="popup-form-labels">Status</Form.Label>
            <Form.Check
              className="form-check-green"
              type="switch"
              label={values.status ? `Active` : 'Inactive'}
              name="status"
              onBlur={handleBlur}
              onChange={() => {
                setFieldValue('status', !values.status);
              }}
              checked={values.status === true}
              isInvalid={touched.status && !!errors.status}
            />
          </Form.Group>
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(RentalItemModal);
