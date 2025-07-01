import { Fragment, useState } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { ErrorMessage, Field, Formik, FormikValues } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useCreateChargeMutation, useDeleteChargeMutation, useUpdateChargeMutation } from 'services/api/charges';
import useResponse from 'services/api/hooks/useResponse';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetUnitByIdQuery } from 'services/api/units';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import { NotesControl } from 'components/notes';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { GroupedField } from 'core-ui/grouped-field';
import { CheckMarkIcon } from 'core-ui/icons';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';
import { Avatar } from 'core-ui/user-avatar';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getReadableError, getSearchFilter, isPositiveNumber, renderFormError } from 'utils/functions';

import { ChargeType, IChargesAPI } from 'interfaces/IAccounting';
import { SearchObject } from 'interfaces/IGeneral';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

const chargeSchema = Yup.object().shape({
  charge_disabled: Yup.boolean(),
  title: Yup.string().trim().required(`this field is required!`).max(65),
  description: Yup.string().trim().required('this field is required!'),
  gl_account: Yup.string().trim().required('this field is required!'),
  parent_property: yupFilterInput.required('this filed is required!'),
  unit: yupFilterInput
    .required('this filed is required!')
    .test('TenantExist', 'This unit is vacant. It cannot be used to create charges', (value, ctx) => {
      if (ctx.parent['charge_disabled'] === true) return true;
      const opt = value.filter(f => (f as SearchObject).tenant_id && Number((f as SearchObject).tenant_id) > 0);
      if (opt.length > 0) return true;
      return false;
    }),
  charge_type: Yup.string()
    .trim()
    .oneOf(['ONE_TIME', 'RECURRING'], 'Invalid option provided!')
    .required('this field is required!'),
  amount: Yup.number().positive().required('this field is required!'),
  notes: Yup.string().trim().required('this field is required!'),
});

interface IProps {
  charge?: IChargesAPI;
  update?: boolean;
}

const ChargesForm = ({ charge, update }: IProps) => {
  const { redirect } = useRedirect();

  const {
    data: property,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getIDFromObject('parent_property', charge));

  const {
    data: unit,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getIDFromObject('unit', charge));

  // create charge
  const [createCharge, { isSuccess: isCreateChargeSuccess, isError: isCreateChargeError, error: chargeError }] =
    useCreateChargeMutation();

  useResponse({
    isSuccess: isCreateChargeSuccess,
    successTitle: 'Charge has been successfully created!',
    isError: isCreateChargeError,
    error: chargeError,
  });

  // update charge
  const [updateCharge, { isSuccess: isUpdateChargeSuccess, isError: isUpdateChargeError, error: chargeUpdateError }] =
    useUpdateChargeMutation();

  useResponse({
    isSuccess: isUpdateChargeSuccess,
    successTitle: 'Charge details has been successfully updated!',
    isError: isUpdateChargeError,
    error: chargeUpdateError,
  });

  const handleFormSubmission = async (values: FormikValues) => {
    let parent_property = 0;
    if (values.parent_property && values.parent_property.length > 0) {
      parent_property = Number((values.parent_property as Array<IPropertyAPI>)[0].id);
    }

    let unit_id = 0;
    if (values.unit && values.unit.length > 0) {
      unit_id = Number((values.unit as Array<IUnitsAPI>)[0].id);
    }

    let tenant_id = 0;
    if (values.unit.length > 0 && (values.unit[0] as SearchObject).tenant_id) {
      tenant_id = Number((values.unit[0] as SearchObject).tenant_id);
    }

    if (parent_property && parent_property > 0 && tenant_id && tenant_id > 0 && unit_id && unit_id > 0) {
      if (charge && update) {
        return await updateCharge({
          ...charge,
          ...values,
          parent_property,
          tenant: tenant_id,
          unit: unit_id,
        });
      } else {
        return await createCharge({
          ...(values as IChargesAPI),
          status: 'UNPAID',
          parent_property,
          tenant: tenant_id,
          unit: unit_id,
        });
      }
    }

    throw new Error('Incomplete information provided');
  };

  const [
    deleteChargeByID,
    { isSuccess: isDeleteChargeSuccess, isError: isDeleteChargeError, error: deleteChargeError },
  ] = useDeleteChargeMutation();

  useResponse({
    isSuccess: isDeleteChargeSuccess,
    successTitle: 'You have deleted a charge',
    isError: isDeleteChargeError,
    error: deleteChargeError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteChargeByID(id)
          .then(result => {
            if (result.data) {
              redirect('/charges', true, 'charges');
            }
          })
          .finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
      }
    });
  };

  return (
    <PageContainer>
      <Formik
        enableReinitialize
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          handleFormSubmission(values)
            .then(results => {
              if (results.data) {
                redirect(`/charges/${results.data.id}/details`, true, 'charges');
              } else {
                const error = results.error as BaseQueryError;
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
            .finally(() => setSubmitting(false));
        }}
        initialValues={{
          charge_disabled: charge && isPositiveNumber(charge.id),
          title: charge?.title ?? '',
          description: charge?.description ?? '',
          gl_account: charge?.gl_account ?? '',
          charge_type: charge?.charge_type ?? ('ONE_TIME' as ChargeType),
          amount: charge?.amount ?? '',
          unit: unit ? [unit] : ([] as Option[]),
          parent_property: property ? [property] : ([] as Option[]),
          notes: charge?.notes ?? '',
        }}
        validationSchema={chargeSchema}
      >
        {({
          errors,
          touched,
          setFieldValue,
          handleSubmit,
          handleChange,
          handleBlur,
          values,
          isSubmitting,
          setFieldTouched,
        }) => (
          <Form noValidate onSubmit={handleSubmit}>
            <Stack className="justify-content-between align-items-end flex-wrap mb-3" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">
                  {charge && update ? `Charges ${charge.slug && charge.slug.toUpperCase()}` : `Create New Charge`}
                </h1>
              </div>
              <div>
                <Button
                  variant="light border-primary"
                  className="px-4 py-1 me-3"
                  type="reset"
                  onClick={() => redirect(-1)}
                >
                  Cancel
                </Button>
                <SubmitBtn loading={isSubmitting} variant="primary" type="submit" className="px-4 py-1">
                  {charge && update ? `Update` : `Save`}
                </SubmitBtn>
              </div>
            </Stack>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Header className="border-0 p-0 bg-transparent text-start">
                <Stack direction="horizontal" className="justify-content-between">
                  <div>
                    <p className="fw-bold m-0 text-primary">Charges Details</p>
                    <p className="small">
                      {charge && update ? 'Modify charges details' : 'Fill out the form to create a charge'}
                    </p>
                  </div>
                  {charge && update && (
                    <DeleteBtn
                      permission={PERMISSIONS.ACCOUNTS}
                      disabled={disabled}
                      onClick={() => deleteRecord(Number(charge.id))}
                      showText
                    />
                  )}
                </Stack>
              </Card.Header>

              <Card.Body className="p-0 mt-4">
                <Row className="align-items-center gx-sm-4 gx-0">
                  <Col sm={6} md={4}>
                    <Form.Group className="mb-4" controlId="ReceiptFormTitle">
                      <Form.Label className="form-label-md">Title</Form.Label>
                      <Field
                        autoFocus
                        type="text"
                        name="title"
                        as={Form.Control}
                        placeholder="Title"
                        isValid={touched.title && !errors.title}
                        isInvalid={touched.title && !!errors.title}
                      />
                      <ErrorMessage className="text-danger" name={'title'} component={Form.Text} />
                    </Form.Group>
                  </Col>

                  <Col xs={'auto'}>
                    <Form.Group as={Col} className="mb-2" xs={12} controlId="ChargesFormRecurring">
                      <Form.Check
                        type={'checkbox'}
                        name={'charge_type'}
                        label="Recurring"
                        className="small text-primary"
                        defaultChecked={values.charge_type === 'RECURRING'}
                        onChange={ev => setFieldValue('charge_type', ev.target.checked ? 'RECURRING' : 'ONE_TIME')}
                        onBlur={() => setFieldTouched('charge_type')}
                        isInvalid={touched.charge_type && !!errors.charge_type}
                      />
                      <ErrorMessage className="text-danger" name={'charge_type'} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={4}>
                    <FilterPaginateInput
                      name="parent_property"
                      model_label="property.Property"
                      labelText="Select Property"
                      controlId={`ChargesFormProperty`}
                      placeholder={`Select`}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-3',
                      }}
                      selected={values.parent_property}
                      onSelectChange={selected => {
                        if (selected.length) {
                          setFieldValue('parent_property', selected);
                        } else {
                          setFieldValue('parent_property', []);
                        }

                        setFieldValue('unit', []);
                      }}
                      renderMenuItemChildren={(option: Option) => {
                        const selected = option as SearchObject;
                        return (
                          <div className="position-relative">
                            <div>
                              <div style={{ marginRight: '5rem' }} className="fw-medium">
                                {selected.name}
                              </div>
                              {selected.is_occupied === null && (
                                <p className="small text-wrap m-0 text-muted">
                                  No units currently available associated with this property
                                </p>
                              )}
                            </div>
                            <div className="position-absolute top-0 end-0">
                              {selected.is_occupied ? <CheckMarkIcon /> : ''}
                            </div>
                          </div>
                        );
                      }}
                      onBlurChange={() => setFieldTouched('parent_property', true)}
                      isValid={touched.parent_property && !errors.parent_property}
                      isInvalid={touched.parent_property && !!errors.parent_property}
                      labelKey={'name'}
                      disabled={propertyLoading || propertyFetching || (charge && Number(charge.parent_property) > 0)}
                      error={errors.parent_property}
                    />
                  </Col>
                  <Col sm={6} md={4}>
                    <FilterPaginateInput
                      name="unit"
                      labelText="Search Unit"
                      model_label="property.Unit"
                      filter={getSearchFilter(values.parent_property, 'parent_property')}
                      controlId={`ChargesFormUnit`}
                      placeholder={`Select Unit`}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-3',
                      }}
                      selected={values.unit}
                      labelKey={'name'}
                      onSelectChange={selected => {
                        if (selected.length) {
                          setFieldValue('unit', selected);
                        } else {
                          setFieldValue('unit', []);
                        }
                      }}
                      renderMenuItemChildren={(option: Option) => {
                        const selected = option as SearchObject;
                        return (
                          <div className="position-relative">
                            <div>
                              <div style={{ marginRight: '5rem' }} className="fw-medium">
                                {selected.name}
                              </div>
                              <p className="small text-wrap m-0 text-muted">
                                {selected.tenant_id ? (
                                  <Fragment>
                                    <span className="fw-bold">Tenant:</span>
                                    <span className="mx-1">{`${selected.tenant_first_name} ${selected.tenant_last_name}`}</span>
                                  </Fragment>
                                ) : (
                                  'Charges cannot be created against vacant units'
                                )}
                              </p>
                            </div>
                            <div className="position-absolute top-0 end-0">
                              {selected.tenant_id ? <CheckMarkIcon /> : ''}
                            </div>
                          </div>
                        );
                      }}
                      onBlurChange={() => setFieldTouched('unit', true)}
                      isValid={touched.unit && !errors.unit}
                      isInvalid={touched.unit && !!errors.unit}
                      preload={getSearchFilter(values.parent_property, 'parent_property', true)}
                      disabled={
                        values.parent_property.length <= 0 ||
                        unitLoading ||
                        unitFetching ||
                        (charge && Number(charge.parent_property) > 0)
                      }
                      error={errors.unit}
                    />
                  </Col>
                </Row>

                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={2}>
                    <GroupedField
                      wrapperClass="mb-4"
                      labelClass="popup-form-labels"
                      controlId="ReceiptFormReceiptAmount"
                      icon={'$'}
                      position="end"
                      label="Charge Amount"
                      min="0"
                      type="number"
                      step={0.1}
                      placeholder="50.00"
                      name="amount"
                      value={values.amount}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      isValid={touched.amount && !errors.amount}
                      isInvalid={touched.amount && !!errors.amount}
                      error={errors.amount}
                    />
                  </Col>
                </Row>
                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={4}>
                    <CustomSelect
                      labelText="GL Account"
                      controlId="ReceiptFormAccount"
                      options={[
                        {
                          label: '15454589 98598956 6566',
                          value: '15454589 98598956 6566',
                        },
                      ]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      name="gl_account"
                      value={values.gl_account}
                      onSelectChange={value => setFieldValue('gl_account', value)}
                      onBlurChange={() => setFieldTouched('gl_account', true)}
                      isValid={touched.gl_account && !errors.gl_account}
                      isInvalid={touched.gl_account && !!errors.gl_account}
                      error={errors.gl_account}
                    />
                  </Col>
                  <Col sm={6} md={4}>
                    {values.unit.length > 0 && (values.unit[0] as SearchObject).tenant_id && (
                      <RenderInformation
                        title="Payer (Tenant)"
                        titleClass="mb-3"
                        html={
                          <Avatar
                            showName
                            size={32}
                            name={`${(values.unit[0] as SearchObject).tenant_first_name} ${(values.unit[0] as SearchObject).tenant_last_name}`}
                          />
                        }
                      />
                    )}
                  </Col>
                </Row>
                <Row className="gx-sm-4 gx-0">
                  <Col sm={6} md={8}>
                    <Form.Group className="mb-4" controlId="ReceiptFormRemarks">
                      <Form.Label className="form-label-md">Remarks</Form.Label>
                      <Form.Control
                        rows={3}
                        placeholder="Some description here"
                        as="textarea"
                        name="description"
                        value={values.description}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        isValid={touched.description && !errors.description}
                        isInvalid={touched.description && !!errors.description}
                      />
                      <ErrorMessage className="text-danger" name={'description'} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Body className="p-0">
                <Row className="gx-sm-4 gx-0">
                  <Col xs={12}>
                    <Form.Group className="mb-4" controlId="ReceiptFormNotes">
                      <Form.Label className="form-label-md mb-0 fw-bold">Notes</Form.Label>
                      <p className="text-muted small">
                        Write down all relevant information and quick notes for your help over here
                      </p>
                      <NotesControl
                        onBlur={handleBlur}
                        value={values.notes}
                        onChange={handleChange}
                        isValid={touched.notes && !errors.notes}
                        isInvalid={touched.notes && !!errors.notes}
                      />
                      <ErrorMessage className="text-danger" name={'notes'} component={Form.Text} />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
};

export default ChargesForm;
