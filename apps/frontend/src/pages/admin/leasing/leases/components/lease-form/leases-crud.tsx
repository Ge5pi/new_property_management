import { Fragment, useCallback, useEffect, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useSearchParams } from 'react-router-dom';

import { clsx } from 'clsx';
import { ErrorMessage, Field, Formik, useFormikContext } from 'formik';

import { getUnitDetails } from 'api/other';
import { useGetRentalApplicantByIdQuery } from 'services/api/applicants';
import { useCreateChargeMutation } from 'services/api/charges';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateLeaseMutation,
  useCreateLeaseTenantMutation,
  useDeleteLeaseMutation,
  useGetLeasesTenantsQuery,
  useRenewLeaseMutation,
  useUpdateLeaseMutation,
  useUpdateLeaseTenantMutation,
} from 'services/api/lease';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import { useGetUnitByIdQuery } from 'services/api/units';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { PreviewLeaseTemplate } from 'core-ui/popups/preview-lease-template';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowScroll } from 'hooks/useWindowScroll';

import { PERMISSIONS } from 'constants/permissions';
import {
  getIDFromObject,
  getReadableError,
  getSearchFilter,
  getStringPersonName,
  getValidID,
  isPositiveNumber,
  renderFormError,
  returnIfHave,
} from 'utils/functions';

import { ChargeType } from 'interfaces/IAccounting';
import {
  IApplicantForm,
  ILeaseCharges,
  ILeaseForm,
  ISecondaryTenant,
  LeaseRentCycle,
  LeaseType,
} from 'interfaces/IApplications';
import { SearchObject } from 'interfaces/IGeneral';
import { IPropertyAPI } from 'interfaces/IProperties';
import { ITenantAPI } from 'interfaces/ITenant';
import { ISingleUnit, IUnitsAPI } from 'interfaces/IUnits';

import formFields, { leaseChargesFormFields, leaseDepositFormFields } from './form-fields';
import formValidation from './form-validation';
import TenantInformation from './tenant-information';

interface IProps {
  lease?: ILeaseForm;
  lease_id?: number;
  operation?: 'update' | 'renew';
}

const LeasesCRUD = ({ operation, lease }: IProps) => {
  const [searchParams] = useSearchParams();
  const { redirect } = useRedirect();

  const { charge_account, charge_amount, charge_description, charge_title, charge_type } = leaseChargesFormFields;

  const [updateLeases] = useUpdateLeaseMutation();

  const [createLeases] = useCreateLeaseMutation();

  const [renewLease] = useRenewLeaseMutation();

  const {
    data: rentalApplicant,
    isLoading: applicantLoading,
    isFetching: applicantFetching,
  } = useGetRentalApplicantByIdQuery(
    searchParams.has('applicant_id')
      ? getValidID(searchParams.get('applicant_id'))
      : getIDFromObject('applicant_id', lease)
  );

  const unit__id = (
    searchParams.has('unit_id') ? getValidID(searchParams.get('unit_id'), false) : getIDFromObject('unit', lease, false)
  ) as number;
  const property__id = (
    searchParams.has('property_id')
      ? getValidID(searchParams.get('property_id'), false)
      : getIDFromObject('property_id', lease, false)
  ) as number;

  const {
    data: lease_unit,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getValidID(unit__id));

  const {
    data: lease_property,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getValidID(property__id));

  const {
    data: secondary_tenants,
    isLoading: LeaseTenantLoading,
    isFetching: LeaseTenantFetching,
  } = useGetLeasesTenantsQuery(getIDFromObject('id', lease));

  // update LeaseTenant
  const [updateLeaseTenant] = useUpdateLeaseTenantMutation();
  const [createLeaseTenant] = useCreateLeaseTenantMutation();

  const [createCharge] = useCreateChargeMutation();

  const handleSecondaryTenantCreation = async (tenants: ISecondaryTenant[], record_id: number) => {
    const promises: Array<GenericMutationResult<Partial<ISecondaryTenant>, 'LeaseTenant', ISecondaryTenant>> = [];
    if (tenants.length > 0) {
      tenants.forEach(tenant => {
        if (tenant.id && Number(tenant.id) > 0) {
          promises.push(updateLeaseTenant({ ...tenant, lease: record_id }));
        } else {
          promises.push(createLeaseTenant({ ...tenant, lease: record_id }));
        }
      });
    }

    return await Promise.all(promises);
  };

  const handleFormSubmission = async (
    values: ILeaseForm,
    tenants: ISecondaryTenant[],
    charge: Partial<ILeaseCharges>
  ) => {
    let feedback = 'created';
    let response: ILeaseForm;
    let record_id = lease && lease.id ? Number(lease.id) : -1;
    if (record_id > 0) {
      const data = { ...values, id: record_id };
      response = operation === 'update' ? await updateLeases(data).unwrap() : await renewLease(data).unwrap();
      feedback = operation + 'ed';
    } else response = await createLeases(values).unwrap();

    record_id = Number(response.id);
    const secondaryTenants = await handleSecondaryTenantCreation(tenants, record_id);
    const failedSecondaryTenantCRUD = secondaryTenants.filter(result => result.error);

    const operationState = !operation || !['renew', 'update'].includes(operation) ? 'new' : operation;
    let chargesFailed = false;
    if (operationState === 'new' && Object.values(charge).every(v => !v && v !== '')) {
      const chargeResponse = await createCharge({
        status: 'UNPAID',
        title: charge.charge_title ?? '',
        gl_account: charge.charge_account ?? '',
        description: charge.charge_description ?? '',
        charge_type: charge.charge_type as ChargeType,
        unit: Number(values.unit),
        amount: Number(charge.charge_amount),
        parent_property: Number(values.property_id),
        notes: 'This charge was created from a lease',
        tenant: Number(values.applicant),
      });

      if (chargeResponse.error) chargesFailed = true;
    }

    let feedbackDescription = `Record has been successfully ${feedback}`;
    if (failedSecondaryTenantCRUD.length > 0 || chargesFailed) {
      feedbackDescription = `Record has been successfully ${feedback}. However there was an issue in modifying some details\n`;
      if (failedSecondaryTenantCRUD.length > 0) {
        feedbackDescription += `Unable to save Secondary Tenant information`;
      }
      if (chargesFailed) {
        feedbackDescription += `Unable to create lease charges`;
      }
    }

    if (failedSecondaryTenantCRUD.length <= 0 && !chargesFailed) {
      return {
        data: response,
        feedback: `Record has been successfully ${feedback}`,
        status: 'success' as 'success' | 'warning',
      };
    }

    return {
      data: response,
      feedback: feedbackDescription,
      status: 'warning' as 'success' | 'warning',
    };
  };

  return (
    <div className="my-3">
      <Formik
        initialValues={{
          lease_disabled: lease && isPositiveNumber(lease.id),
          property: lease_property ? [lease_property] : ([] as Option[]),
          unit: lease_unit ? [lease_unit] : ([] as Option[]),
          applicant: rentalApplicant ? [rentalApplicant] : ([] as Option[]),
          start_date: operation === 'renew' ? new Date().toISOString().split('T')[0] : (lease?.start_date ?? ''),
          end_date: operation === 'renew' ? '' : (lease?.end_date ?? ''),
          lease_type: (lease?.lease_type ?? 'FIXED') as LeaseType,
          secondary_tenants: returnIfHave<ISecondaryTenant>(
            [
              {
                email: '',
                birthday: '',
                first_name: '',
                last_name: '',
                phone_number: '',
                tax_payer_id: '',
                description: '',
              },
            ],
            secondary_tenants
          ),
          gl_account: lease?.gl_account ?? '',
          amount: lease?.amount ?? '',
          description: lease?.description ?? '',
          rent_cycle: lease?.rent_cycle ?? ('MONTHLY' as LeaseRentCycle),
          due_date: operation === 'renew' ? '' : (lease?.due_date ?? ''),

          security_deposit_amount: '',

          charge_title: '',
          charge_description: '',
          charge_amount: '',
          charge_account: '',
          charge_type: '',
        }}
        enableReinitialize
        validationSchema={formValidation}
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          let unit_id = 0;
          let unit_name = '';
          if (values.unit && Array.isArray(values.unit) && values.unit.length > 0) {
            unit_id = Number((values.unit[0] as IUnitsAPI).id);
            unit_name = (values.unit[0] as IUnitsAPI).name;
          }

          let property_id = 0;
          if (values.property && Array.isArray(values.property) && values.property.length > 0) {
            property_id = Number((values.property[0] as IPropertyAPI).id);
          }

          let applicant_id = 0;
          let applicant_name = '';
          if (values.applicant && Array.isArray(values.applicant) && values.applicant.length > 0) {
            const applicant = values.applicant[0] as IApplicantForm;
            applicant_id = Number(applicant.id);
            applicant_name = `${applicant.first_name} ${applicant.last_name}`;
          }

          const operationState = !operation || !['renew', 'update'].includes(operation) ? 'new' : operation;
          const data: ILeaseForm = {
            ...values,
            property_id,
            unit: unit_id,
            applicant: applicant_id,
            amount: Number(values.amount),
            security_deposit_amount: Number(values.security_deposit_amount),
          };

          const charge: Partial<ILeaseCharges> = {
            charge_title: values.charge_title,
            charge_type: values.charge_type as ChargeType,
            charge_amount: values.charge_amount,
          };

          SweetAlert({
            size: 'xl',
            html: (
              <PreviewLeaseTemplate
                lease={values}
                type={operationState}
                property={property_id}
                applicant_name={applicant_name}
                unit_name={unit_name}
              />
            ),
          })
            .fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            })
            .then(result => {
              if (result.isConfirmed) {
                const secondary_tenants = values.secondary_tenants.filter(e => !Object.values(e).every(e => !e));
                handleFormSubmission(data, secondary_tenants, charge)
                  .then(result => {
                    Notify.show({ type: result.status, title: result.feedback });
                    redirect(`/leases/details/${result.data.id}`, true, 'leases');
                  })
                  .catch(err => {
                    Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
                    const error = err as BaseQueryError;
                    if (error.status === 400 && error.data) {
                      renderFormError(error.data, setFieldError);
                    }
                  });
              }
            })
            .finally(() => setSubmitting(false));
        }}
      >
        {({ handleSubmit, values, setFieldTouched, touched, errors, setFieldValue, handleBlur, handleChange }) => (
          <Form className="text-start" noValidate onSubmit={handleSubmit}>
            <PageContainer>
              <FormLayout
                lease_id={Number(lease?.id)}
                unitLoading={unitLoading || unitFetching}
                propertyLoading={propertyLoading || propertyFetching}
                applicantLoading={applicantLoading || applicantFetching}
                tenantFormLoading={LeaseTenantLoading || LeaseTenantFetching}
              />
              {operation !== 'renew' && operation !== 'update' && (
                <Card className="border-0  page-section mb-3">
                  <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
                    <p className="fw-bold m-0 text-primary">Charges</p>
                    <p className="small mb-0">Provide information regarding the charges (if any)</p>
                  </Card.Header>
                  <hr />

                  <Card.Body className="p-4 text-start">
                    <p className="fw-bold text-primary">One time charge</p>
                    <Row className="gx-sm-4 gx-0">
                      <Col sm={8} md={6} xxl={4}>
                        <Form.Group className="mb-4" controlId="LeasingChargesFormTitle">
                          <Form.Label className="form-label-md">Charge Title</Form.Label>
                          <Field
                            type="text"
                            name={charge_title.name}
                            as={Form.Control}
                            placeholder="Type here"
                            isValid={touched.charge_title && !errors.charge_title}
                            isInvalid={touched.charge_title && !!errors.charge_title}
                          />
                          <ErrorMessage className="text-danger" name={charge_title.name} component={Form.Text} />
                        </Form.Group>
                      </Col>
                    </Row>

                    <Row className="gx-sm-4 gx-0">
                      <Col sm={6} md={3}>
                        <GroupedField
                          wrapperClass="mb-4"
                          labelClass="form-label-md"
                          controlId="LeasingChargesFormAmount"
                          icon={'$'}
                          position="end"
                          label="Amount"
                          min="0"
                          type="number"
                          placeholder="0.00"
                          name={charge_amount.name}
                          value={values.charge_amount}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.charge_amount && !errors.charge_amount}
                          isInvalid={touched.charge_amount && !!errors.charge_amount}
                          error={errors.charge_amount}
                        />
                      </Col>
                      <Col sm={6} md={4}>
                        <CustomSelect
                          labelText="GL Account"
                          onSelectChange={value => setFieldValue(charge_account.name, value)}
                          onBlurChange={() => {
                            setFieldTouched(charge_account.name, true);
                          }}
                          value={values.charge_account}
                          name={charge_account.name}
                          controlId="LeasingChargesFormAccount"
                          options={[{ value: '15454589 98598956 6566', label: '15454589 98598956 6566' }]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                          isValid={touched.charge_account && !errors.charge_account}
                          isInvalid={touched.charge_account && !!errors.charge_account}
                          error={errors.charge_account}
                        />
                      </Col>
                      <Col sm={6} md={4}>
                        <CustomSelect
                          labelText="Charge cycle"
                          onSelectChange={value => {
                            setFieldValue(charge_type.name, value);
                            setFieldTouched(charge_type.name, true);
                          }}
                          value={values.charge_type}
                          onBlurChange={() => {
                            setFieldTouched(charge_type.name, true);
                          }}
                          name={charge_type.name}
                          controlId="LeasingCreationFormChargeType"
                          options={[
                            {
                              label: 'One Time',
                              value: 'ONE_TIME',
                            },
                            {
                              label: 'Recurring',
                              value: 'RECURRING',
                            },
                          ]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                          isValid={touched.charge_type && !errors.charge_type}
                          isInvalid={touched.charge_type && !!errors.charge_type}
                          error={<ErrorMessage className="text-danger" name={charge_type.name} component={Form.Text} />}
                        />
                      </Col>
                    </Row>
                    <Row className="gx-sm-4 gx-0">
                      <Col>
                        <Form.Group className="mb-4" controlId="LeasingChargesFormDescription">
                          <Form.Label className="form-label-md">Description</Form.Label>
                          <Form.Control
                            placeholder="Some test here..."
                            as="textarea"
                            rows={5}
                            name={charge_description.name}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            value={values.charge_description}
                            isValid={touched.charge_description && !errors.charge_description}
                            isInvalid={touched.charge_description && !!errors.charge_description}
                          />
                          <ErrorMessage className="text-danger" name={charge_description.name} component={Form.Text} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              )}
            </PageContainer>
          </Form>
        )}
      </Formik>
    </div>
  );
};

interface IFormikForm {
  property: Option[];
  applicant: Option[];
  unit: Option[];
  end_date: string;
  start_date: string;
  lease_type: LeaseType;
  secondary_tenants: ISecondaryTenant;
  gl_account: string;
  amount: number;
  rent_cycle: LeaseRentCycle;
  description: string;
  due_date: string;

  security_deposit_amount: string;
}

interface FormLayoutProps {
  lease_id?: number;
  unitLoading?: boolean;
  propertyLoading?: boolean;
  applicantLoading?: boolean;
  tenantFormLoading?: boolean;
}

const FormLayout = ({
  lease_id,
  propertyLoading,
  unitLoading,
  applicantLoading,
  tenantFormLoading,
}: FormLayoutProps) => {
  const { redirect } = useRedirect();
  const { values, isSubmitting, setFieldTouched, setFieldValue, touched, errors, handleBlur, handleChange } =
    useFormikContext<IFormikForm>();

  const fieldDisabled = Boolean(lease_id && lease_id > 0);
  const onPropertyNameSelected = useCallback(
    (selected: Option[]) => {
      if (fieldDisabled) return;
      if (selected.length) {
        setFieldValue('property', selected);
      } else {
        setFieldValue('property', []);
      }
      setFieldValue('unit', []);
      setFieldValue('amount', '');
      setFieldValue('applicant', []);
    },
    [setFieldValue, fieldDisabled]
  );

  useEffect(() => {
    if (values.unit && Array.isArray(values.unit) && values.unit.length > 0) {
      const id = Number((values.unit[0] as IUnitsAPI).id);
      if (id > 0)
        getUnitDetails(id).then(response => {
          if ((response.data as ISingleUnit).market_rent) {
            setFieldValue('amount', Number((response.data as ISingleUnit).market_rent));
            return;
          }
        });
    }
  }, [values.unit, setFieldValue]);

  const onUnitNameSelected = useCallback(
    (selected: Option[]) => {
      if (fieldDisabled) return;
      if (selected.length) {
        setFieldValue('unit', selected);
        const selectedUnit = selected[0] as IUnitsAPI;
        if ('id' in selectedUnit && selectedUnit.id) {
          getUnitDetails(selectedUnit.id).then(response => {
            if ((response.data as ISingleUnit).market_rent) {
              setFieldValue('amount', Number((response.data as ISingleUnit).market_rent));
            }
          });
        }
      } else {
        setFieldValue('unit', []);
      }
      setFieldValue('applicant', []);
    },
    [setFieldValue, fieldDisabled]
  );

  const onApplicantNameSelected = useCallback(
    (selected: Option[]) => {
      if (fieldDisabled) return;
      if (selected.length) {
        setFieldValue('applicant', selected);
      } else {
        setFieldValue('applicant', []);
      }
    },
    [setFieldValue, fieldDisabled]
  );

  const [deleteLeaseByID, { isSuccess: isDeleteLeaseSuccess, isError: isDeleteLeaseError, error: deleteLeaseError }] =
    useDeleteLeaseMutation();

  useResponse({
    isSuccess: isDeleteLeaseSuccess,
    successTitle: 'You have deleted Lease',
    isError: isDeleteLeaseError,
    error: deleteLeaseError,
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
        deleteLeaseByID(id)
          .then(result => {
            if (result.data) {
              redirect('/leases', true, 'leases');
            }
          })
          .finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
      }
    });
  };

  const {
    property,
    end_date,
    due_date,
    lease_type,
    start_date,
    unit,
    gl_account,
    amount,
    rent_cycle,
    applicant,
    description,
  } = formFields;

  const { scrollY } = useWindowScroll();
  const { security_deposit_amount } = leaseDepositFormFields;

  return (
    <Fragment>
      <div className={clsx('my-3', { 'px-3 sticky-top bg-white': scrollY > 150 })}>
        <Row className={clsx({ 'align-items-end': scrollY <= 150 }, { 'align-items-baseline': scrollY > 150 })}>
          <Col>
            <div>
              <BackButton className={clsx({ 'd-none': scrollY > 150 })} />
              <h1 className="fw-bold h4 mt-1"> Lease Form </h1>
            </div>
          </Col>
          <Col sm={'auto'}>
            <div className="my-3">
              <Stack gap={3} className="justify-content-end" direction="horizontal">
                {isPositiveNumber(lease_id) && (
                  <DeleteBtn
                    disabled={disabled}
                    permission={PERMISSIONS.LEASING}
                    onClick={() => lease_id && deleteRecord(lease_id)}
                    showText
                  />
                )}
                <Button variant="light border-primary" type="reset" className="px-4 py-1" onClick={() => redirect(-1)}>
                  Cancel
                </Button>
                <SubmitBtn variant="primary" type="submit" className="px-4 py-1" loading={isSubmitting}>
                  {isPositiveNumber(lease_id) ? 'Update' : 'Save'}
                </SubmitBtn>
              </Stack>
            </div>
          </Col>
        </Row>
      </div>

      <Card className="border-0 p-4 page-section mb-3">
        <Card.Header className="border-0 p-0 bg-transparent text-start">
          <p className="fw-bold m-0 text-primary">
            {isPositiveNumber(lease_id) ? 'Lease update form' : 'Lease creation form'}
          </p>
          <p className="small">Provide information regarding the applicant</p>
        </Card.Header>

        <Card.Body className="px-0 text-start">
          <Row className="gx-sm-4 gx-0">
            <Col sm={8} md={6} xxl={4}>
              <FilterPaginateInput
                name={property.name}
                model_label="property.Property"
                labelText="Select Property"
                controlId={`LeasingCreationFormPropertyName`}
                placeholder={`Select`}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
                selected={values.property}
                onSelectChange={onPropertyNameSelected}
                renderMenuItemChildren={(option: Option) => {
                  const selected = option as SearchObject;
                  return (
                    <div className="position-relative">
                      <div>
                        <div style={{ marginRight: '5rem' }} className="fw-medium">
                          {selected.name}
                        </div>
                        <p className="small text-wrap m-0 text-muted">
                          {selected.is_late_fee_policy_configured && selected.is_occupied === false
                            ? 'Verified'
                            : !selected.is_occupied
                              ? 'No unit found associated with this property'
                              : 'Please make sure the property is vacant and late fee policy is configured'}
                        </p>
                      </div>
                      <div className="position-absolute top-0 end-0">
                        <Badge
                          pill
                          bg={
                            selected.is_late_fee_policy_configured && selected.is_occupied === false
                              ? 'success'
                              : 'warning'
                          }
                          className="small fw-normal"
                        >
                          {selected.is_late_fee_policy_configured && selected.is_occupied === false
                            ? 'Available'
                            : 'Unavailable'}
                        </Badge>
                      </div>
                    </div>
                  );
                }}
                labelKey={'name'}
                onBlurChange={() => setFieldTouched('property', true)}
                isValid={touched.property && !errors.property}
                isInvalid={touched.property && !!errors.property}
                disabled={propertyLoading || fieldDisabled}
                error={<ErrorMessage className="text-danger" name={property.name} component={Form.Text} />}
              />
            </Col>
            <Col sm={8} md={6} xxl={4}>
              <FilterPaginateInput
                name={unit.name}
                labelText="Search Unit"
                model_label="property.Unit"
                filter={getSearchFilter(values.property, 'parent_property')}
                controlId={`LeasingCreationFormUnit`}
                placeholder={`Select Unit`}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
                selected={values.unit}
                labelKey={'name'}
                onSelectChange={onUnitNameSelected}
                renderMenuItemChildren={(option: Option) => {
                  const selected = option as SearchObject;
                  return (
                    <div className="position-relative">
                      <div>
                        <div style={{ marginRight: '5rem' }} className="fw-medium">
                          {selected.name}
                        </div>
                        <p className="small text-wrap m-0 text-muted">
                          {selected.is_occupied === false
                            ? 'Available'
                            : !selected.is_occupied
                              ? 'No unit found associated with this property!'
                              : 'Unit is occupied'}
                        </p>
                      </div>
                      <div className="position-absolute top-0 end-0">
                        <Badge
                          pill
                          bg={selected.is_occupied === false ? 'success' : 'warning'}
                          className="small fw-normal"
                        >
                          {selected.is_occupied === false ? 'Available' : 'Occupied'}
                        </Badge>
                      </div>
                    </div>
                  );
                }}
                onBlurChange={() => setFieldTouched(unit.name, true)}
                isValid={touched.unit && !errors.unit}
                isInvalid={touched.unit && !!errors.unit}
                preload={getSearchFilter(values.property, 'parent_property', true)}
                disabled={
                  values.property.length <= 0 ||
                  unitLoading ||
                  propertyLoading ||
                  fieldDisabled ||
                  (touched.property && !!errors.property)
                }
                error={errors.unit}
              />
            </Col>
          </Row>
          <Row className="gx-sm-4 gx-0">
            <Col sm={6} md={6} xxl={4}>
              <FilterPaginateInput
                name={applicant.name}
                labelText="Search Applicant"
                model_label="lease.Applicant"
                filter={getSearchFilter(values.unit, 'unit')}
                controlId={`LeasingCreationFormApplicant`}
                placeholder={`Applicant Name`}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-3',
                }}
                selected={values.applicant}
                onSelectChange={onApplicantNameSelected}
                onBlurChange={() => setFieldTouched(applicant.name, true)}
                isValid={touched.applicant && !errors.applicant}
                isInvalid={touched.applicant && !!errors.applicant}
                preload={getSearchFilter(values.unit, 'unit', true)}
                filterBy={['first_name', 'last_name']}
                inputProps={{
                  style: {
                    paddingLeft: values.applicant.length > 0 ? `2.5rem` : '',
                  },
                }}
                labelKey={option => getStringPersonName(option as ITenantAPI)}
                renderMenuItemChildren={option => <ItemMenuItem option={option as ITenantAPI} />}
                renderInput={(inputProps, { selected }) => {
                  const option = selected.length > 0 ? (selected[0] as ITenantAPI) : undefined;
                  return <ItemInputItem {...inputProps} option={option} />;
                }}
                disabled={
                  values.unit.length <= 0 ||
                  unitLoading ||
                  propertyLoading ||
                  applicantLoading ||
                  fieldDisabled ||
                  (touched.property && !!errors.property) ||
                  (touched.unit && !!errors.unit)
                }
                error={<ErrorMessage className="text-danger" name={applicant.name} component={Form.Text} />}
              />
            </Col>
            <Col sm={6} lg={4}>
              <CustomSelect
                labelText={'Lease type'}
                onSelectChange={value => setFieldValue(lease_type.name, value)}
                onBlurChange={() => {
                  setFieldTouched(lease_type.name, true);
                }}
                name={lease_type.name}
                value={values.lease_type}
                controlId="LeasingCreationFormLeaseType"
                options={[
                  { value: 'FIXED', label: 'Fixed' },
                  { value: 'AT_WILL', label: 'At Will' },
                ]}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-4',
                }}
                isValid={touched.lease_type && !errors.lease_type}
                isInvalid={touched.lease_type && !!errors.lease_type}
                error={<ErrorMessage className="text-danger" name={lease_type.name} component={Form.Text} />}
              />
            </Col>
          </Row>
          <Row className="gx-sm-4 gx-0">
            <Col sm={6} md={4} xl={3} xxl={2}>
              <InputDate
                labelText={'Start Date'}
                controlId={'LeasingCreationFormStartDate'}
                classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                onDateSelection={date => setFieldValue(start_date.name, date)}
                onBlur={handleBlur}
                name={start_date.name}
                value={values.start_date}
                isValid={touched.start_date && !errors.start_date}
                isInvalid={touched.start_date && !!errors.start_date}
                error={<ErrorMessage className="text-danger" name={start_date.name} component={Form.Text} />}
                disabled={fieldDisabled}
              />
            </Col>
            <Col sm={6} md={4} xl={3} xxl={2}>
              <InputDate
                labelText={'End Date'}
                controlId={'LeasingCreationFormEndDate'}
                classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                onDateSelection={date => setFieldValue(end_date.name, date)}
                minDate={new Date(values.start_date)}
                onBlur={handleBlur}
                name={end_date.name}
                value={values.end_date}
                isValid={touched.end_date && !errors.end_date}
                isInvalid={touched.end_date && !!errors.end_date}
                error={<ErrorMessage className="text-danger" name={end_date.name} component={Form.Text} />}
              />
            </Col>
            <Col sm={6} md={4} xl={3} xxl={2}>
              <InputDate
                labelText={'Due Date'}
                controlId={'LeasingCreationFormDueDate'}
                classNames={{ wrapperClass: 'mb-4', labelClass: 'form-label-md' }}
                onDateSelection={date => setFieldValue(due_date.name, date)}
                onBlur={handleBlur}
                name={due_date.name}
                value={values.due_date}
                minDate={new Date(values.start_date)}
                maxDate={new Date(values.end_date)}
                isValid={touched.due_date && !errors.due_date}
                isInvalid={touched.due_date && !!errors.due_date}
                error={<ErrorMessage className="text-danger" name={due_date.name} component={Form.Text} />}
              />
            </Col>
          </Row>

          <TenantInformation formLoading={tenantFormLoading} />

          <div className="mt-4">
            <p className="fw-bold m-0 text-primary">Rent Details</p>
            <p className="small">Provide information regarding the rent</p>
          </div>

          <Row className="gx-sm-4 gx-0">
            <Col sm={6} md={3}>
              <CustomSelect
                labelText="Rent cycle"
                onSelectChange={value => setFieldValue(rent_cycle.name, value)}
                value={values.rent_cycle}
                onBlurChange={() => setFieldTouched(rent_cycle.name, true)}
                name={rent_cycle.name}
                controlId="LeasingCreationFormRentCycle"
                options={[
                  {
                    label: 'Weekly',
                    value: 'WEEKLY',
                  },
                  {
                    label: 'Monthly',
                    value: 'MONTHLY',
                  },
                  {
                    label: 'Quarterly',
                    value: 'QUARTERLY',
                  },
                  {
                    label: 'Six Months',
                    value: 'SIX_MONTHS',
                  },
                  {
                    label: 'Yearly',
                    value: 'YEARLY',
                  },
                ]}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-4',
                }}
                isValid={touched.rent_cycle && !errors.rent_cycle}
                isInvalid={touched.rent_cycle && !!errors.rent_cycle}
                error={<ErrorMessage className="text-danger" name={rent_cycle.name} component={Form.Text} />}
              />
            </Col>
          </Row>

          <Row className="gx-sm-4 gx-0">
            <Col sm={6} md={3}>
              <GroupedField
                wrapperClass="mb-4"
                labelClass="form-label-md"
                controlId="LeasingCreationFormRentAmount"
                icon={'$'}
                position="end"
                label="Amount"
                min="0"
                type="number"
                step={0.01}
                placeholder="0.00"
                name={amount.name}
                value={values.amount}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.amount && !errors.amount}
                isInvalid={touched.amount && !!errors.amount}
                error={errors.amount}
              />
            </Col>
            <Col sm={6} md={4}>
              <CustomSelect
                labelText="GL Account"
                onSelectChange={value => setFieldValue(gl_account.name, value)}
                onBlurChange={() => {
                  setFieldTouched(gl_account.name, true);
                }}
                name={gl_account.name}
                controlId="LeasingCreationFormRentAccount"
                options={[{ value: '15454589 98598956 6566', label: '15454589 98598956 6566' }]}
                classNames={{
                  labelClass: 'popup-form-labels',
                  wrapperClass: 'mb-4',
                }}
                value={values.gl_account}
                isValid={touched.gl_account && !errors.gl_account}
                isInvalid={touched.gl_account && !!errors.gl_account}
                error={<ErrorMessage className="text-danger" name={gl_account.name} component={Form.Text} />}
              />
            </Col>
          </Row>
          <Row className="gx-sm-4 gx-0">
            <Col>
              <Form.Group className="mb-4" controlId="LeasingCreationFormDescription">
                <Form.Label className="form-label-md">Description</Form.Label>
                <Form.Control
                  placeholder="Some test here..."
                  as="textarea"
                  rows={5}
                  value={values.description}
                  name={description.name}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.description && !errors.description}
                  isInvalid={touched.description && !!errors.description}
                />
                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card className="border-0  page-section mb-3">
        <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
          <p className="fw-bold m-0 text-primary">Security Deposit</p>
          <p className="small mb-0">Provide information regarding the security deposit</p>
        </Card.Header>
        <hr />

        <Card.Body className="p-4 text-start">
          <Row className="gx-sm-4 gx-0">
            <Col sm={6} md={3}>
              <GroupedField
                wrapperClass="mb-4"
                labelClass="form-label-md"
                controlId="LeasingCreationFormSecurityAmount"
                icon={'$'}
                position="end"
                label="Amount"
                min="0"
                type="number"
                placeholder="0.00"
                name={security_deposit_amount.name}
                value={values.security_deposit_amount}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.security_deposit_amount && !errors.security_deposit_amount}
                isInvalid={touched.security_deposit_amount && !!errors.security_deposit_amount}
                error={errors.security_deposit_amount}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Fragment>
  );
};

export default LeasesCRUD;
