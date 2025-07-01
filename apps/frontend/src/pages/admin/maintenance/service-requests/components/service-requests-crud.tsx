import { useCallback, useState } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetPropertyByIdQuery } from 'services/api/properties';
import {
  useCreateServiceRequestAttachmentsMutation,
  useCreateServiceRequestMutation,
  useDeleteServiceRequestAttachmentsMutation,
  useGetServiceRequestAttachmentsQuery,
  useUpdateServiceRequestMutation,
} from 'services/api/service-requests';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import { useGetUnitByIdQuery } from 'services/api/units';

import { BackButton } from 'components/back-button';
import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, getSearchFilter, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IRequestAttachments } from 'interfaces/IMaintenance';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IServiceRequestAPI, ISingleServiceRequest, PriorityType } from 'interfaces/IServiceRequests';
import { IUnitsAPI } from 'interfaces/IUnits';
import { WorkOrderType } from 'interfaces/IWorkOrders';

import '../../maintenance.styles.css';

const ServiceReqSchema = Yup.object().shape({
  property: yupFilterInput.required('this filed is required!'),
  unit: yupFilterInput.required('this filed is required!'),
  permission_to_enter: Yup.boolean()
    .oneOf([true, false], 'Selected value must be one of "true" or "false"')
    .default(false),
  subject: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().required('This field is required!').min(5),
  additional_information_for_entry: Yup.string().trim().min(5),
  priority: Yup.string()
    .required('This field is required!')
    .oneOf(['URGENT', 'NORMAL', 'LOW'], 'Invalid option provided'),
  order_type: Yup.string()
    .required('This field is required!')
    .oneOf(['INTERNAL', 'RESIDENT', 'UNIT_TURN'], 'Invalid option provided'),
  files: Yup.array().of(Yup.mixed()),
});

interface IProps {
  service_request?: ISingleServiceRequest;
  update?: boolean;
}

const ServiceRequestsCRUD = ({ service_request, update }: IProps) => {
  const { redirect } = useRedirect();

  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getIDFromObject('property_id', service_request));
  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getIDFromObject('unit', service_request));

  const {
    data: request_attachments,
    isLoading: requestAttachmentsLoading,
    isFetching: requestAttachmentsFetching,
  } = useGetServiceRequestAttachmentsQuery(getIDFromObject('id', service_request));

  const [createServiceRequest] = useCreateServiceRequestMutation();
  const [updateServiceRequest] = useUpdateServiceRequestMutation();

  const [createServiceRequestAttachment] = useCreateServiceRequestAttachmentsMutation();
  const [deleteServiceRequestAttachment] = useDeleteServiceRequestAttachmentsMutation();

  const [deletedFiles, setDeletedFiles] = useState<IRequestAttachments[]>([]);

  const { selectedFiles, setSelectedFiles, handleUpload, progress, filesData, isUploading } =
    useUploader('service-requests');

  const handleFormSubmission = async (values: IServiceRequestAPI) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = service_request && service_request.id ? Number(service_request.id) : -1;
    const response =
      update && record_id > 0
        ? await updateServiceRequest({ ...values, id: record_id }).unwrap()
        : await createServiceRequest(values).unwrap();

    record_id = Number(response.id);
    const attachments = await handleAttachments(attachedFiles, record_id);
    const failedUploads = attachments.filter(result => result.error);
    await handleDeleteOldAttachments(deletedFiles);

    if (failedUploads.length <= 0) {
      return {
        data: response,
        feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
        status: 'success' as 'success' | 'warning',
      };
    }

    return {
      data: response,
      feedback: `${failedUploads.length}/${selectedFiles.length} files failed to upload. However, the record may have already been ${update ? 'updated!' : 'created!'}`,
      status: 'warning' as 'success' | 'warning',
    };
  };

  const handleAttachments = async (files: IFileInfo[], attachment__id: number) => {
    const attachments = files.map(result => ({
      name: result.name,
      file: result.unique_name,
      file_type: result.ext.toUpperCase(),
      service_request: attachment__id,
    })) as Array<IRequestAttachments>;

    const promises: Array<
      GenericMutationResult<IRequestAttachments, 'ServiceRequestsAttachments', IRequestAttachments>
    > = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createServiceRequestAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: IRequestAttachments[]) => {
    const promises: Array<GenericMutationResult<IRequestAttachments, 'ServiceRequestsAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deleteServiceRequestAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      property: property_data ? [property_data] : ([] as Option[]),
      unit: unit_data ? [unit_data] : ([] as Option[]),
      permission_to_enter: service_request?.permission_to_enter ?? false,
      additional_information_for_entry: service_request?.additional_information_for_entry ?? '',
      description: service_request?.description ?? '',
      subject: service_request?.subject ?? '',
      priority: service_request?.priority ?? ('LOW' as PriorityType),
      order_type: service_request?.order_type ?? ('INTERNAL' as WorkOrderType),
      old_files: request_attachments ? request_attachments : ([] as IRequestAttachments[]),
      files: [] as File[],
    },
    validationSchema: ServiceReqSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      let unit_id = 0;
      if (values.unit && values.unit.length > 0) {
        unit_id = Number((values.unit as Array<IUnitsAPI>)[0].id);
      }

      let property_id = 0;
      if (values.property && Array.isArray(values.property) && values.property.length > 0) {
        property_id = Number((values.property[0] as IPropertyAPI).id);
      }

      const data: IServiceRequestAPI = {
        ...values,
        property_id,
        unit: unit_id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          redirect(`/service-requests/details/${result.data.id}`, true, 'service-requests');
        })
        .catch(err => {
          Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
          const error = err as BaseQueryError;
          if (error.status === 400 && error.data) {
            renderFormError(error.data, setFieldError);
          }
        })
        .finally(() => {
          setSubmitting(false);
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    setFieldError,
    isSubmitting,
    handleBlur,
    errors,
  } = formik;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        let aFiles = acceptedFiles;
        if (values.files && Array.isArray(values.files)) {
          const initialValue = values.files as File[];
          aFiles = [...aFiles, ...initialValue];
          aFiles = aFiles.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
        }

        setSelectedFiles(aFiles);
        setFieldValue('files', aFiles);
      }
    },
    [setFieldValue, values.files, setSelectedFiles]
  );

  const handleRemoveCurrentFiles = (file: IRequestAttachments, current: IRequestAttachments[]) => {
    const removedFile = current.find(cur => cur.name === file.name);
    const remainingFiles = current.filter(cur => cur.name !== file.name);

    setFieldValue('old_files', remainingFiles);
    setDeletedFiles(prev => {
      if (removedFile) prev.push(removedFile);
      return prev;
    });
  };

  return (
    <div className="my-3">
      <BackButton />
      <h1 className="fw-bold h4 mt-1">{`${update ? 'Update' : 'Create'} Service Request`}</h1>
      <PageContainer>
        <div className="container-fluid page-section pt-4 pb-3">
          <Form noValidate onSubmit={handleSubmit}>
            <Card className="border-0">
              <Card.Header className="border-0 px-md-3 px-0  bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Service request form</p>
                <p className="small">
                  Add the required information to
                  {update
                    ? ' update desired service request information'
                    : ' create as new service request by filling out the following form'}
                </p>
              </Card.Header>
              <Card.Body className="px-md-3 px-0 text-start">
                <div>
                  <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                    <Col lg={6} md={8}>
                      <FilterPaginateInput
                        name="property"
                        model_label="property.Property"
                        labelText="Select Property"
                        controlId={`FixedAssetImportFormProperty`}
                        placeholder={`Select`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.property}
                        onSelectChange={selected => {
                          if (selected.length) {
                            setFieldValue('property', selected);
                          } else {
                            setFieldValue('property', []);
                          }

                          setFieldValue('unit', []);
                        }}
                        labelKey={'name'}
                        onBlurChange={() => setFieldTouched('property', true)}
                        isValid={touched.property && !errors.property}
                        isInvalid={touched.property && !!errors.property}
                        disabled={propertyLoading || propertyFetching}
                        error={errors.property}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                    <Col lg={6} md={8}>
                      <FilterPaginateInput
                        name="unit"
                        labelText="Search Unit"
                        model_label="property.Unit"
                        filter={getSearchFilter(values.property, 'parent_property')}
                        controlId={`ServiceRequestFormUnit`}
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
                        onBlurChange={() => setFieldTouched('unit', true)}
                        isValid={touched.unit && !errors.unit}
                        isInvalid={touched.unit && !!errors.unit}
                        preload={getSearchFilter(values.property, 'parent_property', true)}
                        disabled={values.property.length <= 0 || unitLoading || unitFetching}
                        error={errors.unit}
                      />
                    </Col>
                  </Row>
                  <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                    <Col md={4} sm={6}>
                      <CustomSelect
                        labelText="Work order type"
                        controlId={`ServiceRequestFormWorkOrderType`}
                        placeholder={`Select`}
                        options={[
                          { value: 'INTERNAL', label: 'Internal' },
                          { value: 'RESIDENT', label: 'Resident' },
                          { value: 'UNIT_TURN', label: 'Unit Turn' },
                        ]}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        name="order_type"
                        value={values.order_type}
                        onSelectChange={value => setFieldValue('order_type', value)}
                        onBlurChange={() => setFieldTouched('order_type', true)}
                        isValid={touched.order_type && !errors.order_type}
                        isInvalid={touched.order_type && !!errors.order_type}
                        error={errors.order_type}
                      />
                    </Col>
                  </Row>
                  <Row className="gx-0 py-2 my-1 justify-content-start align-items-start">
                    <Form.Group as={Col} xs={'auto'} controlId="ServiceRequestFormPermissionEnter">
                      <Card.Text className="popup-form-labels px-0 me-sm-3 me-2">Permission to enter</Card.Text>
                    </Form.Group>
                    <Form.Group as={Col} xs={'auto'} controlId="ServiceRequestFormPermissionEnterYes">
                      <Form.Check
                        type={'radio'}
                        label={`Okay`}
                        name="permission_to_enter"
                        defaultChecked={values.permission_to_enter === true}
                        onChange={() => setFieldValue('permission_to_enter', true)}
                        onBlur={() => setFieldTouched('permission_to_enter')}
                        isInvalid={touched.permission_to_enter && !!errors.permission_to_enter}
                        className="small text-primary"
                      />
                    </Form.Group>
                    <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="ServiceRequestFormPermissionEnterNo">
                      <Form.Check
                        type={'radio'}
                        label={`Not Okay`}
                        defaultChecked={values.permission_to_enter === false}
                        onChange={() => setFieldValue('permission_to_enter', false)}
                        onBlur={() => setFieldTouched('permission_to_enter')}
                        isInvalid={touched.permission_to_enter && !!errors.permission_to_enter}
                        className="small text-primary"
                        name="permission_to_enter"
                      />
                    </Form.Group>
                  </Row>
                  <Row className="gb-4 gx-sm-5 gx-0">
                    <Col xxl={4} xl={5} md={6}>
                      <Form.Group className="mb-4" controlId="ServiceRequestFormSubject">
                        <Form.Label className="form-label-md">Subject</Form.Label>
                        <Form.Control
                          type="text"
                          name="subject"
                          value={values.subject}
                          onBlur={handleBlur}
                          onChange={handleChange}
                          isValid={touched.subject && !errors.subject}
                          isInvalid={touched.subject && !!errors.subject}
                          placeholder="Add subject here"
                        />
                        <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="gb-4 gx-sm-5 gx-0">
                    <Col xxl={4} xl={5} md={6}>
                      <Form.Group className="mb-4" controlId="ServiceRequestFormDescription">
                        <Form.Label className="popup-form-labels">Description</Form.Label>
                        <Form.Control
                          placeholder="Some test here..."
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
                    <Col xxl={4} xl={5} md={6}>
                      <Form.Group className="mb-4" controlId="ServiceRequestFormAdditionalInformation">
                        <Form.Label className="popup-form-labels">
                          Additional information regarding the entry
                        </Form.Label>
                        <Form.Control
                          placeholder="Some test here..."
                          as="textarea"
                          rows={5}
                          name="additional_information_for_entry"
                          value={values.additional_information_for_entry}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          isValid={touched.additional_information_for_entry && !errors.additional_information_for_entry}
                          isInvalid={
                            touched.additional_information_for_entry && !!errors.additional_information_for_entry
                          }
                        />
                        <Form.Control.Feedback type="invalid">
                          {errors.additional_information_for_entry}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>
                  <Row className="gx-0 py-2 my-1 justify-content-start align-items-start">
                    <Form.Group as={Col} xs={'auto'} controlId="ServiceRequestFormPriority">
                      <Card.Text className="popup-form-labels px-0 me-sm-3 me-2">Priority</Card.Text>
                    </Form.Group>
                    <Form.Group as={Col} xs={'auto'} controlId="ServiceRequestFormPriorityUrgent">
                      <Form.Check
                        type={'radio'}
                        label={`Urgent`}
                        name="priority"
                        defaultChecked={values.priority === 'URGENT'}
                        onChange={() => setFieldValue('priority', 'URGENT')}
                        onBlur={() => setFieldTouched('priority')}
                        isInvalid={touched.priority && !!errors.priority}
                        className="small text-primary"
                      />
                    </Form.Group>
                    <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="ServiceRequestFormPriorityNormal">
                      <Form.Check
                        type={'radio'}
                        label={`Normal`}
                        name="priority"
                        defaultChecked={values.priority === 'NORMAL'}
                        onChange={() => setFieldValue('priority', 'NORMAL')}
                        onBlur={() => setFieldTouched('priority')}
                        isInvalid={touched.priority && !!errors.priority}
                        className="small text-primary"
                      />
                    </Form.Group>
                    <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="ServiceRequestFormPriorityLow">
                      <Form.Check
                        type={'radio'}
                        label={`Low`}
                        name="priority"
                        defaultChecked={values.priority === 'LOW'}
                        onChange={() => setFieldValue('priority', 'LOW')}
                        onBlur={() => setFieldTouched('priority')}
                        isInvalid={touched.priority && !!errors.priority}
                        className="small text-primary"
                      />
                    </Form.Group>
                  </Row>
                </div>
                <Row className="mb-4">
                  <Col xxl={6} lg={8} xs={12}>
                    <Form.Group controlId="NotesFormAttachments">
                      <Form.Label className="form-label-md">Attachments</Form.Label>
                      <div className="ratio ratio-21x9">
                        <Dropzone
                          name="files"
                          onDrop={onDrop}
                          disabled={requestAttachmentsFetching || requestAttachmentsLoading}
                          accept={FILE_TYPES_DOCS_IMAGES}
                          onError={error => setFieldError('files', error.message)}
                          maxSize={5242880}
                        />
                      </div>
                      <Form.Control.Feedback
                        type="invalid"
                        className={clsx({ 'd-block': touched.files && !!errors.files })}
                      >
                        {errors.files?.toString()}
                      </Form.Control.Feedback>
                    </Form.Group>
                  </Col>
                </Row>
                <Row>
                  {values.files.map(file => {
                    const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
                    const progressed = currentProgress && currentProgress.progress ? currentProgress.progress : 0;

                    return (
                      <Col key={file.name} xxl={4} xl={6} lg={4} md={6}>
                        <FileAttachments
                          onRemove={() => {
                            const remainingFiles = values.files.filter(value => value.name !== file.name);
                            setFieldValue('files', remainingFiles);
                            setSelectedFiles(remainingFiles);
                          }}
                          progress={progressed}
                          file={file}
                        />
                      </Col>
                    );
                  })}
                  {values.old_files.map((file, indx) => (
                    <Col key={indx} xxl={4} xl={6} lg={4} md={6}>
                      <FileAttachments onRemove={() => handleRemoveCurrentFiles(file, values.old_files)} file={file} />
                    </Col>
                  ))}
                </Row>
              </Card.Body>
              <Card.Footer className="bg-transparent border-0">
                <Stack direction="horizontal" gap={2} className="justify-content-end">
                  <Button
                    type="reset"
                    variant="light border-primary"
                    onClick={() => redirect(-1)}
                    className="px-4 py-1 me-3"
                  >
                    Cancel
                  </Button>

                  <SubmitBtn
                    type="submit"
                    variant="primary"
                    loading={isSubmitting || isUploading}
                    className="px-4 py-1"
                  >
                    {update ? 'Update' : 'Save'}
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

export default ServiceRequestsCRUD;
