import { useCallback, useMemo, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Spinner, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import {
  useCreateServiceRequestAttachmentsMutation,
  useCreateServiceRequestMutation,
  useDeleteServiceRequestAttachmentsMutation,
  useGetServiceRequestAttachmentsQuery,
  useUpdateServiceRequestMutation,
} from 'services/api/service-requests';
import { useGetTenantsUserInformationQuery } from 'services/api/tenants/tenant';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';

import { BackButton } from 'components/back-button';
import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IRequestAttachments } from 'interfaces/IMaintenance';
import { IServiceRequestAPI, ISingleServiceRequest, PriorityType } from 'interfaces/IServiceRequests';

const ServiceReqSchema = Yup.object().shape({
  permission_to_enter: Yup.boolean()
    .oneOf([true, false], 'Selected value must be one of "true" or "false"')
    .default(false),
  subject: Yup.string().trim().required('This field is required!'),
  description: Yup.string().trim().required('This field is required!').min(5),
  additional_information_for_entry: Yup.string().trim().min(5),
  priority: Yup.string()
    .required('This field is required!')
    .oneOf(['URGENT', 'NORMAL', 'LOW'], 'Invalid option provided'),
  files: Yup.array().of(Yup.mixed()),
});

interface IProps {
  service_request?: ISingleServiceRequest;
  update?: boolean;
}

function RequestsCRUD({ update, service_request }: IProps) {
  const { redirect } = useRedirect();
  const tenant = useGetTenantsUserInformationQuery();

  const {
    data: request_attachments,
    isLoading: requestAttachmentsLoading,
    isFetching: requestAttachmentsFetching,
  } = useGetServiceRequestAttachmentsQuery(getIDFromObject('id', service_request));

  const unit__id = useMemo(() => {
    const id = getIDFromObject('unit', service_request, false) as number;
    if (id && id > 0) {
      return id;
    } else {
      if (tenant.data) {
        return tenant.data.unit_id;
      }
    }
  }, [tenant, service_request]);

  const property__id = useMemo(() => {
    const id = getIDFromObject('property_id', service_request, false) as number;
    if (id && id > 0) {
      return id;
    } else {
      if (tenant.data) {
        return tenant.data.property_id;
      }
    }
  }, [tenant, service_request]);

  const [updateServiceRequest] = useUpdateServiceRequestMutation();
  const [createServiceRequest] = useCreateServiceRequestMutation();

  const [deletedFiles, setDeletedFiles] = useState<IRequestAttachments[]>([]);
  const { selectedFiles, setSelectedFiles, handleUpload, progress, filesData, isUploading } =
    useUploader('service-requests');

  const [createServiceRequestAttachment] = useCreateServiceRequestAttachmentsMutation();
  const [deleteServiceRequestAttachment] = useDeleteServiceRequestAttachmentsMutation();

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
      permission_to_enter: service_request?.permission_to_enter ?? false,
      additional_information_for_entry: service_request?.additional_information_for_entry ?? '',
      description: service_request?.description ?? '',
      subject: service_request?.subject ?? '',
      priority: service_request?.priority ?? ('LOW' as PriorityType),
      old_files: request_attachments ? request_attachments : ([] as IRequestAttachments[]),
      files: [] as File[],
    },
    validationSchema: ServiceReqSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      if (!unit__id || !property__id) {
        Notify.show({ type: 'warning', title: 'Property/Unit details not found!' });
        setSubmitting(false);
        return;
      }

      const data: IServiceRequestAPI = {
        ...values,
        order_type: 'RESIDENT',
        property_id: property__id,
        unit: unit__id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          redirect(`/requests/details/${result.data.id}`, true, 'requests');
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
    [setSelectedFiles, setFieldValue, values.files]
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
      <h1 className="fw-bold h4 mt-1">{`${update ? 'Update' : 'Create'} Maintenance Request`}</h1>
      <PageContainer>
        <ApiResponseWrapper
          {...tenant}
          renderResults={() => (
            <div className="container-fluid page-section pt-4 pb-3">
              <Form noValidate onSubmit={handleSubmit}>
                <Card className="border-0">
                  <Card.Header className="border-0 px-md-3 px-0  bg-transparent text-start">
                    <p className="fw-bold m-0 text-primary">Maintenance Request Form</p>
                    <p className="small">Fill out the form to {update ? 'update' : 'create'} request</p>
                  </Card.Header>
                  <Card.Body className="px-md-3 px-0 text-start">
                    <Row className="gx-1">
                      <Col xxl={6} lg={7} xs={12}>
                        <Container fluid>
                          <Row className="gx-1">
                            <Col xxl={6} lg={7} md={6}>
                              <Form.Group className="mb-4" controlId="ServiceRequestFormSubject">
                                <Form.Label className="form-label-md">Subject</Form.Label>
                                <Form.Control
                                  type="text"
                                  name="subject"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.subject}
                                  isValid={touched.subject && !errors.subject}
                                  isInvalid={touched.subject && !!errors.subject}
                                  placeholder="Add subject here"
                                />
                                <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col xxl={8} lg={9} md={8}>
                              <Form.Group className="mb-4" controlId="ServiceRequestFormDescription">
                                <Form.Label className="popup-form-labels">Description</Form.Label>
                                <Form.Control
                                  placeholder="Some test here..."
                                  as="textarea"
                                  rows={5}
                                  name="description"
                                  onBlur={handleBlur}
                                  onChange={handleChange}
                                  value={values.description}
                                  isValid={touched.description && !errors.description}
                                  isInvalid={touched.description && !!errors.description}
                                />
                                <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                            <Col xxl={8} lg={9} md={8}>
                              <Form.Group className="mb-4" controlId="ServiceRequestFormAdditionalInformation">
                                <Form.Label className="popup-form-labels">
                                  Additional information regarding the entry
                                </Form.Label>
                                <Form.Control
                                  placeholder="Add additional information such as do you have any pets? etc."
                                  as="textarea"
                                  rows={5}
                                  name="additional_information_for_entry"
                                  onChange={handleChange}
                                  onBlur={handleBlur}
                                  value={values.additional_information_for_entry}
                                  isValid={
                                    touched.additional_information_for_entry && !errors.additional_information_for_entry
                                  }
                                  isInvalid={
                                    touched.additional_information_for_entry &&
                                    !!errors.additional_information_for_entry
                                  }
                                />
                                <Form.Control.Feedback type="invalid">
                                  {errors.additional_information_for_entry}
                                </Form.Control.Feedback>
                              </Form.Group>
                            </Col>
                          </Row>

                          <Row className="gx-1 py-2 my-1 justify-content-start align-items-start">
                            <Form.Group as={Col} xs={'auto'} controlId="ServiceRequestFormPermissionEnter">
                              <Card.Text className="popup-form-labels px-0 me-sm-3 me-2">
                                <span className="text-lowercase">
                                  Do we have permission to <br /> enter in property, if you are not at home?
                                </span>
                              </Card.Text>
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
                            <Form.Group
                              as={Col}
                              xs={'auto'}
                              className="ms-3"
                              controlId="ServiceRequestFormPermissionEnterNo"
                            >
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
                            <Form.Group
                              as={Col}
                              xs={'auto'}
                              className="ms-3"
                              controlId="ServiceRequestFormPriorityNormal"
                            >
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
                        </Container>
                      </Col>
                      <Col lg xs={12}>
                        <Container fluid>
                          <Row className="mb-4">
                            <Col xs={12}>
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
                        </Container>
                      </Col>
                      <Col xs={12}>
                        <Container fluid>
                          <Row>
                            {values.files.map(file => {
                              const currentProgress = progress.find(p =>
                                filesData.find(f => f.unique_name === p.file_id)
                              );
                              const progressed =
                                currentProgress && currentProgress.progress ? currentProgress.progress : 0;

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
                                <FileAttachments
                                  onRemove={() => handleRemoveCurrentFiles(file, values.old_files)}
                                  file={file}
                                />
                              </Col>
                            ))}
                          </Row>
                        </Container>
                      </Col>
                    </Row>
                  </Card.Body>
                  <Card.Footer className="bg-transparent border-0">
                    <Stack gap={3} direction="horizontal" className="justify-content-end mt-5 align-items-center">
                      {isSubmitting && isUploading && <Spinner size="sm" />}
                      <Button
                        variant="light border-primary"
                        onClick={() => redirect(-1)}
                        type="reset"
                        className="px-4 py-1 me-3"
                      >
                        Cancel
                      </Button>

                      <SubmitBtn type="submit" variant="primary" loading={isSubmitting} className="px-4 py-1">
                        {update ? 'Update' : 'Save'}
                      </SubmitBtn>
                    </Stack>
                  </Card.Footer>
                </Card>
              </Form>
            </div>
          )}
        />
      </PageContainer>
    </div>
  );
}

export default RequestsCRUD;
