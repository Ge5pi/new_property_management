import { Fragment, useCallback, useState } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { searchWithoutPagination } from 'api/core';
import useResponse from 'services/api/hooks/useResponse';
import { useGetServiceRequestsByIdQuery } from 'services/api/service-requests';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetUserByIdQuery } from 'services/api/users';
import { useGetVendorTypesByIdQuery } from 'services/api/vendor-types';
import { useGetVendorsByIdQuery } from 'services/api/vendors';
import { useCreateWorkOrderMutation, useUpdateWorkOrderMutation } from 'services/api/work-orders';

import { BackButton } from 'components/back-button';
import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterInput, FilterPaginateInput } from 'core-ui/custom-select';
import { UsersPlusIcon } from 'core-ui/icons';
import { InputDate } from 'core-ui/input-date';

import { useRedirect } from 'hooks/useRedirect';

import { getIDFromObject, getSearchFilter, getStringPersonName, getValidID, renderFormError } from 'utils/functions';

import { IUser } from 'interfaces/IAvatar';
import { RecurringCycle } from 'interfaces/IGeneral';
import { IVendor, IVendorType } from 'interfaces/IPeoples';
import { IServiceRequestAPI } from 'interfaces/IServiceRequests';
import { IWorkOrdersAPI, WorkOrderType } from 'interfaces/IWorkOrders';

import '../maintenance.styles.css';

const WorkOrderSchema = Yup.object().shape({
  vendor: yupFilterInput.required('this filed is required!'),
  vendor_type: yupFilterInput.required('this filed is required!'),
  service_request: yupFilterInput.required('this filed is required!'),
  is_recurring: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(false),
  cycle: Yup.string()
    .trim()
    .when('is_recurring', {
      is: true,
      then: schema =>
        schema.required('This field is required!').oneOf(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SIX_MONTHS']),
    }),
  owner_approved: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(false),
  email_vendor: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(false),
  request_receipt: Yup.boolean().oneOf([true, false], 'Selected value must be one of "true" or "false"').default(false),
  assign_to: yupFilterInput.required('this filed is required!'),
  job_description: Yup.string()
    .trim()
    .required('This field is required!')
    .min(3, 'Text must be minimum 5 characters long'),
  vendor_instructions: Yup.string().trim().min(3, 'Text must be minimum 5 characters long'),
  order_type: Yup.string()
    .required('This field is required!')
    .oneOf(['INTERNAL', 'RESIDENT', 'UNIT_TURN'], 'Invalid option provided'),
  follow_up_date: Yup.date().required('This field is required!'),
});

interface IProps {
  order?: number;
  service_request_id?: number;
  work_order?: IWorkOrdersAPI;
}

const WorkOrderCRUD = ({ order, service_request_id, work_order }: IProps) => {
  const { redirect } = useRedirect();

  // update WorkOrder
  const [
    updateWorkOrder,
    { isSuccess: isUpdateWorkOrderSuccess, isError: isUpdateWorkOrderError, error: updateWorkOrderError },
  ] = useUpdateWorkOrderMutation();

  useResponse({
    isSuccess: isUpdateWorkOrderSuccess,
    successTitle: 'Work Order has been successfully updated!',
    isError: isUpdateWorkOrderError,
    error: updateWorkOrderError,
  });

  const [
    createWorkOrder,
    { isSuccess: isCreateWorkOrderSuccess, isError: isCreateServiceRequestError, error: createServiceRequestError },
  ] = useCreateWorkOrderMutation();

  useResponse({
    isSuccess: isCreateWorkOrderSuccess,
    successTitle: 'New work order has been successfully created!',
    isError: isCreateServiceRequestError,
    error: createServiceRequestError,
  });

  const {
    data: request,
    isLoading: serviceRequestLoading,
    isFetching: serviceRequestFetching,
  } = useGetServiceRequestsByIdQuery(getValidID(service_request_id));

  const {
    data: vendor,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
  } = useGetVendorsByIdQuery(getIDFromObject('vendor', work_order));

  const {
    data: vendor_type,
    isLoading: vendorTypeLoading,
    isFetching: vendorTypeFetching,
  } = useGetVendorTypesByIdQuery(getIDFromObject('vendor_type', work_order));

  const {
    data: assign_to,
    isLoading: assignLoading,
    isFetching: assignFetching,
  } = useGetUserByIdQuery(getIDFromObject('assign_to', work_order));

  const formik = useFormik({
    initialValues: {
      service_request: request ? [request] : ([] as Option[]),
      vendor: vendor ? [vendor] : ([] as Option[]),
      vendor_type: vendor_type ? [vendor_type] : ([] as Option[]),
      assign_to: assign_to ? [assign_to] : ([] as Option[]),
      vendor_instructions: work_order?.vendor_instructions ?? '',
      job_description: work_order?.job_description ?? '',
      is_recurring: work_order?.is_recurring ?? false,
      request_receipt: work_order?.is_recurring ?? false,
      owner_approved: work_order?.owner_approved ?? false,
      email_vendor: work_order?.email_vendor ?? false,
      cycle: work_order?.cycle ?? ('MONTHLY' as RecurringCycle),
      order_type: work_order?.order_type ?? ('RESIDENT' as WorkOrderType),
      follow_up_date: work_order?.follow_up_date ?? '',
    },
    validationSchema: WorkOrderSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      const vendor_id = Number((values.vendor as Array<IVendor>)[0].id);
      const vendor_type_id = Number((values.vendor_type as Array<IVendorType>)[0].id);
      const service_request = Number((values.service_request as Array<IServiceRequestAPI>)[0].id);
      const user_id = Number((values.assign_to as Array<IUser>)[0].id);

      let data: IWorkOrdersAPI = {
        ...values,
        service_request,
        status: 'ASSIGNED',
        vendor: vendor_id,
        assign_to: user_id,
        vendor_type: vendor_type_id,
        cycle: values.is_recurring ? values.cycle : undefined,
      };

      const update = Boolean(Number(order) > 0);
      if (update && work_order && work_order.id && work_order.service_request) {
        data = {
          ...data,
          id: Number(work_order.id),
        };
        updateWorkOrder &&
          updateWorkOrder(data)
            .then(result => {
              if (result.data) {
                redirect(`/work-orders/${data.id}/details/${service_request}`, true, 'work-orders');
              } else {
                const error = result.error as BaseQueryError;
                if (error.status === 400 && error.data) {
                  renderFormError(error.data, setFieldError);
                }
              }
            })
            .finally(() => setSubmitting(false));
      } else {
        createWorkOrder &&
          createWorkOrder(data)
            .then(result => {
              if (result.data) {
                redirect(`/work-orders`, true, 'work-orders');
              } else {
                const error = result.error as BaseQueryError;
                if (error.status === 400 && error.data) {
                  renderFormError(error.data, setFieldError);
                }
              }
            })
            .finally(() => setSubmitting(false));
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
    handleBlur,
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

  const onVendorTypeSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('vendor_type', selected);
      } else {
        setFieldValue('vendor_type', []);
      }
      setFieldValue('vendor', []);
    },
    [setFieldValue]
  );

  const onUserSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('assign_to', selected);
      } else {
        setFieldValue('assign_to', []);
      }
    },
    [setFieldValue]
  );

  const [serviceRequests, setServiceRequests] = useState<Array<IServiceRequestAPI>>([]);
  const handleServiceReqSearch = (query: string) => {
    searchWithoutPagination('maintenance.ServiceRequest', query).then(res => setServiceRequests(res.data));
  };

  const onServiceRequestSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('service_request', selected);
      } else {
        setFieldValue('service_request', []);
      }
    },
    [setFieldValue]
  );

  return (
    <div className="my-3">
      <BackButton />
      <h1 className="fw-bold h4 mt-1">{`${Number(order) > 0 ? 'Update' : 'Create'} Work Order`}</h1>
      <PageContainer>
        <div className="container-fluid page-section pt-4 pb-3">
          <Form noValidate onSubmit={handleSubmit}>
            <Card className="border-0">
              <Card.Header className="px-md-3 px-0 border-0 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Work order form</p>
                <p className="small">
                  Add the required information to
                  {Number(order) > 0 ? ' update current work order' : ' create a new work order'}
                </p>
              </Card.Header>
              <Card.Body className="px-md-3 px-0 text-start">
                <div>
                  <Row className="align-items-stretch gx-sm-5 gx-0">
                    <Col xl={4} lg={6} md={6}>
                      <FilterInput
                        name="service_request"
                        labelText="Select Service Request"
                        filterBy={['slug', 'description']}
                        controlId={`WorkOrdersFormServiceRequest`}
                        placeholder={`Service Request ID`}
                        options={serviceRequests}
                        autoFocus
                        classNames={{
                          labelClass: 'popup-form-labels',
                          selectClass: 'text-capitalize',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.service_request}
                        onSelectChange={onServiceRequestSelected}
                        onBlurChange={() => setFieldTouched('service_request', true)}
                        isValid={touched.service_request && !errors.service_request}
                        isInvalid={touched.service_request && !!errors.service_request}
                        onSearch={handleServiceReqSearch}
                        labelKey={'slug'}
                        renderMenuItemChildren={(option: Option) => (
                          <div className="small">
                            <div className="fw-bold text-uppercase">{(option as IServiceRequestAPI).slug}</div>
                            <div className="text-truncate small">{(option as IServiceRequestAPI).description}</div>
                          </div>
                        )}
                        disabled={serviceRequestLoading || serviceRequestFetching}
                        error={errors.service_request}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-start gx-sm-4 gx-0">
                    <Col xxl={4} lg={6} md={8}>
                      <Form.Group className="mb-3" controlId="WorkOrdersFormDescription">
                        <Form.Label className="popup-form-labels">Job Description</Form.Label>
                        <Form.Control
                          placeholder="Some test here..."
                          as="textarea"
                          rows={5}
                          name="job_description"
                          value={values.job_description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.job_description && !errors.job_description}
                          isInvalid={touched.job_description && !!errors.job_description}
                        />
                        <Form.Control.Feedback type="invalid">{errors.job_description}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                    <Col xxl={5} lg={6} md={8}>
                      <Row className="g-1 mt-1 justify-content-between">
                        <Form.Group as={Col} md={6} xs={'auto'} controlId="WorkOrdersFormRecurringWork">
                          <Form.Check
                            type={'checkbox'}
                            label={`Recurring work order`}
                            className="small text-primary"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="is_recurring"
                            checked={values.is_recurring}
                            isInvalid={touched.is_recurring && !!errors.is_recurring}
                          />
                          <CustomSelect
                            controlId="WorkOrdersFormRecurringWorkSelect"
                            options={[
                              {
                                label: 'Daily',
                                value: 'DAILY',
                              },
                              {
                                label: 'Weekly',
                                value: 'WEEKLY',
                              },
                              {
                                label: 'Monthly',
                                value: 'MONTHLY',
                              },
                              {
                                label: 'Yearly',
                                value: 'YEARLY',
                              },
                              {
                                label: 'Six Months',
                                value: 'SIX_MONTHS',
                              },
                            ]}
                            disabled={!values.is_recurring}
                            classNames={{
                              labelClass: 'popup-form-labels',
                              wrapperClass: 'mb-3',
                            }}
                            placeholder="Select"
                            name="cycle"
                            value={values.cycle}
                            onSelectChange={value => setFieldValue('cycle', value)}
                            onBlurChange={() => setFieldTouched('cycle', true)}
                            isValid={touched.cycle && !errors.cycle}
                            isInvalid={touched.cycle && !!errors.cycle}
                            error={errors.cycle}
                          />
                        </Form.Group>
                        <Form.Group as={Col} md={4} xs={'auto'} controlId="WorkOrdersFormApprovedOwner">
                          <Form.Check
                            type={'checkbox'}
                            label={`Owner Approved`}
                            className="small text-primary"
                            onChange={handleChange}
                            onBlur={handleBlur}
                            name="owner_approved"
                            checked={values.owner_approved}
                            isInvalid={touched.owner_approved && !!errors.owner_approved}
                          />
                        </Form.Group>
                      </Row>
                    </Col>
                  </Row>
                  <Row className="align-items-stretch gx-sm-3 gx-0">
                    <Col xxl={3} md={6}>
                      <FilterPaginateInput
                        name="vendor_type"
                        model_label="people.VendorType"
                        labelText="Select Vendor Type"
                        controlId={`WorkOrdersFormVendorType`}
                        placeholder={`Select`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        searchIcon={false}
                        selected={values.vendor_type}
                        onSelectChange={onVendorTypeSelected}
                        onBlurChange={() => setFieldTouched('vendor_type', true)}
                        isValid={touched.vendor_type && !errors.vendor_type}
                        isInvalid={touched.vendor_type && !!errors.vendor_type}
                        labelKey={'name'}
                        disabled={vendorTypeLoading || vendorTypeFetching}
                        error={errors.vendor_type}
                      />
                    </Col>
                    <Col xxl={5} md={6}>
                      <FilterPaginateInput
                        name="vendor"
                        labelText="Vendor"
                        model_label="people.Vendor"
                        inputProps={{
                          style: {
                            paddingLeft: values.vendor.length > 0 ? `2.5rem` : '',
                          },
                        }}
                        filter={getSearchFilter(values.vendor_type, 'vendor_type')}
                        controlId={`WorkOrdersFormVendor`}
                        placeholder={`Choose Vendor`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.vendor}
                        onSelectChange={onVendorNameSelected}
                        onBlurChange={() => setFieldTouched('vendor', true)}
                        isValid={touched.vendor && !errors.vendor}
                        isInvalid={touched.vendor && !!errors.vendor}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as IVendor)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as IVendor} />}
                        renderInput={(inputProps, { selected }) => {
                          const option = selected.length > 0 ? (selected[0] as IVendor) : undefined;
                          return <ItemInputItem {...inputProps} option={option} />;
                        }}
                        preload={getSearchFilter(values.vendor_type, 'vendor_type', true)}
                        disabled={vendorLoading || vendorFetching || values.vendor_type.length <= 0}
                        error={errors.vendor}
                      />
                    </Col>
                  </Row>

                  <Row className="gb-4 gx-sm-5 gx-0">
                    <Col xxl={4} xl={5} md={8}>
                      <Form.Group className="mb-3" controlId="WorkOrdersFormVendorInstructions">
                        <Form.Label className="popup-form-labels">Vendor Instructions</Form.Label>
                        <Form.Control
                          placeholder="Some test here..."
                          as="textarea"
                          rows={5}
                          name="vendor_instructions"
                          value={values.vendor_instructions}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.vendor_instructions && !errors.vendor_instructions}
                          isInvalid={touched.vendor_instructions && !!errors.vendor_instructions}
                        />
                        <Form.Control.Feedback type="invalid">{errors.vendor_instructions}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="gx-0 py-2 my-1 justify-content-start align-items-start">
                    <Form.Group as={Col} xs={12} controlId="WorkOrdersFormEmailVendor">
                      <Form.Check
                        type={'checkbox'}
                        label={`Email vendor a source link to view this work order`}
                        className="small text-primary"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="email_vendor"
                        checked={values.email_vendor}
                        isInvalid={touched.email_vendor && !!errors.email_vendor}
                      />
                    </Form.Group>
                    <Form.Group as={Col} xs={12} controlId="WorkOrdersFormReqVendor">
                      <Form.Check
                        type={'checkbox'}
                        label={`Request vendor to confirm receipt of work order`}
                        className="small text-primary"
                        onChange={handleChange}
                        onBlur={handleBlur}
                        name="request_receipt"
                        checked={values.request_receipt}
                        isInvalid={touched.request_receipt && !!errors.request_receipt}
                      />
                    </Form.Group>
                  </Row>
                  <Row className="align-items-stretch gx-sm-3 gx-0">
                    <Col md={6}>
                      <CustomSelect
                        controlId="WorkOrdersFormOrderTypeSelect"
                        options={[
                          {
                            label: 'Internal',
                            value: 'INTERNAL',
                          },
                          {
                            label: 'Resident',
                            value: 'RESIDENT',
                          },
                          {
                            label: 'Unit Turn',
                            value: 'UNIT_TURN',
                          },
                        ]}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        name="order_type"
                        placeholder="Select"
                        labelText={'Work Order Type'}
                        value={values.order_type}
                        onSelectChange={value => setFieldValue('order_type', value)}
                        onBlurChange={() => setFieldTouched('order_type', true)}
                        isValid={touched.order_type && !errors.order_type}
                        isInvalid={touched.order_type && !!errors.order_type}
                        error={errors.order_type}
                      />
                    </Col>
                    <Col xxl={3} lg={4} md={6}>
                      <FilterPaginateInput
                        model_label="authentication.User"
                        name="assign_to"
                        labelText={
                          <Fragment>
                            Assign To <UsersPlusIcon />
                          </Fragment>
                        }
                        inputProps={{
                          style: {
                            paddingLeft: values.assign_to.length > 0 ? `2.5rem` : '',
                          },
                        }}
                        controlId={`WorkOrdersFormAssignTo`}
                        placeholder={`Choose a user`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.assign_to}
                        onSelectChange={onUserSelected}
                        onBlurChange={() => setFieldTouched('assign_to', true)}
                        isValid={touched.assign_to && !errors.assign_to}
                        isInvalid={touched.assign_to && !!errors.assign_to}
                        filterBy={['username', 'first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as IUser)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as IUser} />}
                        renderInput={(inputProps, { selected }) => {
                          const option = selected.length > 0 ? (selected[0] as IUser) : undefined;
                          return <ItemInputItem {...inputProps} option={option} />;
                        }}
                        searchIcon={false}
                        disabled={assignLoading || assignFetching}
                        error={errors.assign_to}
                      />
                    </Col>
                    <Col xxl={3} lg={4} md={6}>
                      <InputDate
                        labelText={'Follow up Date'}
                        controlId="WorkOrdersFormFollowDate"
                        classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
                        onDateSelection={date => setFieldValue('follow_up_date', date)}
                        name={'follow_up_date'}
                        onBlur={handleBlur}
                        minDate={new Date()}
                        value={values.follow_up_date}
                        isValid={touched.follow_up_date && !errors.follow_up_date}
                        isInvalid={touched.follow_up_date && !!errors.follow_up_date}
                        error={errors.follow_up_date}
                      />
                    </Col>
                  </Row>
                </div>
              </Card.Body>
              <Card.Footer className="px-0 bg-transparent border-0">
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                  <Button
                    variant="light border-primary"
                    onClick={() => redirect(-1)}
                    type="reset"
                    className="px-4 py-1 me-3"
                  >
                    Cancel
                  </Button>

                  <SubmitBtn type="submit" variant="primary" loading={isSubmitting} className="px-4 py-1">
                    Save
                  </SubmitBtn>
                </Stack>
              </Card.Footer>
            </Card>
          </Form>
        </div>
      </PageContainer>
    </div>
  );
};

export default WorkOrderCRUD;
