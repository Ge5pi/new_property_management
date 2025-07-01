import { useCallback, useMemo, useState } from 'react';
import { Badge, Button, Card, Col, Form, Row, Spinner, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { skipToken } from '@reduxjs/toolkit/query';
import { clsx } from 'clsx';
import { useFormik } from 'formik';

import { useCreateEmailSignatureMutation, useGetEmailSignatureByIdQuery } from 'services/api/email-signature';
import { useCreateEmailMutation } from 'services/api/emails';
import { useGetListOfOwnersQuery } from 'services/api/owners';
import { useGetListOfTenantsQuery } from 'services/api/tenants';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetListOfUnitsQuery } from 'services/api/units';
import { useGetListOfVendorsQuery } from 'services/api/vendors';

import { BackButton } from 'components/back-button';
import { ItemMenuItem } from 'components/custom-cell';
import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import { Signature } from 'components/signature';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { RenderInformation } from 'core-ui/render-information';
import { RichTextEditor } from 'core-ui/text-editor';
import { Notify } from 'core-ui/toast';

import { useAuthState } from 'hooks/useAuthState';
import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { FILE_ALL_TYPES } from 'constants/file-types';
import { getIDFromObject, getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IEmailTemplateAPI, IndividualRecipientType, RecipientType } from 'interfaces/ICommunication';
import { IOwner, IVendor } from 'interfaces/IPeoples';
import { ITenantAPI } from 'interfaces/ITenant';
import { IUnitsAPI } from 'interfaces/IUnits';

import formFields from './form-fields';
import formValidation from './form-validation';

const EmailCRUD = () => {
  const { user } = useAuthState();
  const { redirect } = useRedirect();

  const { setTotalFiles, setSelectedFiles, selectedFiles, handleUpload, progress, filesData, isUploading } =
    useUploader('emails');

  const {
    subject,
    recipient_type,
    tenants,
    owners,
    vendors,
    units,
    template,
    individual_recipient_type,
    body,
    signature,
    existing_signature,
  } = formFields;

  const [selectedTemplate, setTemplate] = useState<IEmailTemplateAPI>();
  const {
    data: tenants_data,
    isLoading: tenantsLoading,
    isFetching: tenantsFetching,
  } = useGetListOfTenantsQuery(
    selectedTemplate && selectedTemplate.tenants && selectedTemplate.tenants.length > 0
      ? selectedTemplate.tenants
      : skipToken
  );

  const {
    data: owners_data,
    isLoading: ownersLoading,
    isFetching: ownersFetching,
  } = useGetListOfOwnersQuery(
    selectedTemplate && selectedTemplate.owners && selectedTemplate.owners.length > 0
      ? selectedTemplate.owners
      : skipToken
  );

  const {
    data: vendors_data,
    isLoading: vendorsLoading,
    isFetching: vendorsFetching,
  } = useGetListOfVendorsQuery(
    selectedTemplate && selectedTemplate.vendors && selectedTemplate.vendors.length > 0
      ? selectedTemplate.vendors
      : skipToken
  );

  const {
    data: units_data,
    isLoading: unitsLoading,
    isFetching: unitsFetching,
  } = useGetListOfUnitsQuery(
    selectedTemplate && selectedTemplate.units && selectedTemplate.units.length > 0 ? selectedTemplate.units : skipToken
  );

  const {
    data: signature_data,
    isLoading: signatureLoading,
    isFetching: signatureFetching,
  } = useGetEmailSignatureByIdQuery(getIDFromObject('signature', selectedTemplate));

  const [createEmail] = useCreateEmailMutation();

  const [createSignature] = useCreateEmailSignatureMutation();
  const handleFormSubmission = async (values: Omit<IEmailTemplateAPI, 'signature'>, signature?: string | number) => {
    let sigID = signature && typeof signature === 'number' ? Number(signature) : undefined;
    if (signature && typeof signature === 'string') {
      const res = await createSignature({ text: signature }).unwrap();
      sigID = Number(res.id);
    }

    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachments = (await Promise.all(promises)).map(v => ({
      name: v.name,
      file: v.unique_name,
      file_type: v.ext.toUpperCase(),
    }));
    const response = await createEmail({ ...values, attachments, signature: sigID }).unwrap();

    return {
      data: response,
      feedback: `Email has been sent to all selected personals`,
      status: 'success' as 'success' | 'warning',
    };
  };

  const {
    touched,
    errors,
    handleSubmit,
    isSubmitting,
    values,
    setFieldValue,
    handleChange,
    setFieldTouched,
    setFieldError,
    handleBlur,
  } = useFormik({
    initialValues: {
      recipient_type: selectedTemplate ? selectedTemplate.recipient_type : ('INDIVIDUAL' as RecipientType),
      individual_recipient_type:
        selectedTemplate && selectedTemplate.individual_recipient_type
          ? selectedTemplate.individual_recipient_type
          : ('TENANT' as IndividualRecipientType),
      template: selectedTemplate ? [selectedTemplate] : ([] as Option[]),
      tenants: tenants_data ? tenants_data : ([] as Option[]),
      owners: owners_data ? owners_data : ([] as Option[]),
      vendors: vendors_data ? vendors_data : ([] as Option[]),
      units: units_data ? units_data : ([] as Option[]),
      subject: selectedTemplate ? selectedTemplate.subject : '',
      body: selectedTemplate ? selectedTemplate.body : '',
      signature: signature_data && signature_data.text !== 'IMAGE' ? signature_data.text : '',
      existing_signature: signature_data ? Number(signature_data.id) : null,
      attachments: [] as File[],
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      const units: Array<number> = [];
      const vendors: Array<number> = [];
      const owners: Array<number> = [];
      const tenants: Array<number> = [];

      let template = null;
      if (values.template && values.template.length > 0) {
        template = Number((values.template as Array<IEmailTemplateAPI>)[0].id);
      } else if (selectedTemplate && Number(selectedTemplate.id) > 0) {
        template = Number(selectedTemplate.id);
      }

      (values.units as IUnitsAPI[]).forEach(selected => {
        units.push(Number(selected.id));
      });

      (values.vendors as IVendor[]).forEach(selected => {
        vendors.push(Number(selected.id));
      });

      (values.owners as IOwner[]).forEach(selected => {
        owners.push(Number(selected.id));
      });

      (values.tenants as ITenantAPI[]).forEach(selected => {
        tenants.push(Number(selected.id));
      });

      let signature = undefined;
      if (values.existing_signature && values.existing_signature > 0) {
        signature = values.existing_signature;
      } else {
        if (values.signature && values.signature !== 'IMAGE') {
          signature = values.signature;
        }
      }

      const data = {
        ...values,
        units,
        template,
        tenants,
        vendors,
        owners,
      } as Omit<IEmailTemplateAPI, 'signature'>;

      handleFormSubmission(data, signature)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          redirect(`/emails/details/${result.data.id}`, true, 'emails');
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
    validationSchema: formValidation,
  });

  const onTemplateSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('template', selected);
      } else {
        setFieldValue('template', []);
      }
    },
    [setFieldValue]
  );

  const onTenantSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as ITenantAPI[];
        selection = selection.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.first_name.toLowerCase().trim() === value.first_name.toLowerCase().trim() &&
                t.last_name.toLowerCase().trim() === value.last_name.toLowerCase().trim()
            )
        );
        setFieldValue('tenants', selection);
      } else {
        setFieldValue('tenants', []);
      }
    },
    [setFieldValue]
  );

  const onOwnerSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IOwner[];
        selection = selection.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.first_name.toLowerCase().trim() === value.first_name.toLowerCase().trim() &&
                t.last_name.toLowerCase().trim() === value.last_name.toLowerCase().trim()
            )
        );
        setFieldValue('owners', selection);
      } else {
        setFieldValue('owners', []);
      }
    },
    [setFieldValue]
  );

  const onVendorSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IVendor[];
        selection = selection.filter(
          (value, index, self) =>
            index ===
            self.findIndex(
              t =>
                t.first_name.toLowerCase().trim() === value.first_name.toLowerCase().trim() &&
                t.last_name.toLowerCase().trim() === value.last_name.toLowerCase().trim()
            )
        );
        setFieldValue('vendors', selection);
      } else {
        setFieldValue('vendors', []);
      }
    },
    [setFieldValue]
  );

  const onUnitSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        let selection = selected as IUnitsAPI[];
        selection = selection.filter(
          (value, index, self) =>
            index === self.findIndex(t => t.name.toLowerCase().trim() === value.name.toLowerCase().trim())
        );
        setFieldValue('units', selection);
      } else {
        setFieldValue('units', []);
      }
    },
    [setFieldValue]
  );

  const currentType = useMemo(() => {
    const individual_type = values.individual_recipient_type;
    const recipient_type = values.recipient_type;

    if (recipient_type === 'INDIVIDUAL') {
      return individual_type;
    }

    return recipient_type;
  }, [values.individual_recipient_type, values.recipient_type]);

  const isRecordFetching = useMemo(() => {
    return tenantsLoading || tenantsFetching || ownersLoading || ownersFetching || vendorsLoading || vendorsFetching;
  }, [tenantsLoading, tenantsFetching, ownersLoading, ownersFetching, vendorsLoading, vendorsFetching]);

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        let files = acceptedFiles;
        if (values.attachments && Array.isArray(values.attachments)) {
          const initialValue = values.attachments as File[];
          files = [...files, ...initialValue];
          files = files.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
        }

        setSelectedFiles(files);
        setFieldValue('files', files);
        setTotalFiles(files.length);
      }
    },
    [setTotalFiles, setSelectedFiles, setFieldValue, values.attachments]
  );

  const handleDropzoneManually = (name: string) => {
    const dropzone = document.querySelector(`#dropzone-${name}`);
    if (dropzone) {
      const browse = dropzone.querySelector('button');
      if (browse) {
        browse.click();
        setFieldTouched(name, true);
      }
    }
  };

  const onAttachmentClick = () => handleDropzoneManually('attachments');
  const resetSelectedValues = useCallback(
    (fieldName: string) => {
      setFieldValue(fieldName, []);
    },
    [setFieldValue]
  );

  return (
    <PageContainer>
      <BackButton />

      <Card className="mt-3 border-0 p-0 page-section mb-3">
        <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
          <h1 className="fw-bold h5 m-0">Compose Email</h1>
        </Card.Header>

        <Card.Body className="p-4 text-start announcements-steps-card">
          <Form className="text-start" noValidate onSubmit={handleSubmit}>
            {user && (
              <RenderInformation
                title="From"
                description={
                  <Badge pill bg="light" className="px-4 py-2">
                    <a className="link link-info" href={`mailto:${user.email}`} rel="noreferrer" target="_blank">
                      <span className="h6 fw-medium">{`< ${user.email} >`}</span>
                    </a>
                  </Badge>
                }
              />
            )}
            <Row>
              <Col lg={8} md={10}>
                <FilterPaginateInput
                  autoFocus
                  name={template.name}
                  labelText={'Select template'}
                  placeholder={`Search for a template (optional)`}
                  controlId={`EmailFormTemplate`}
                  classNames={{
                    labelClass: 'popup-form-labels',
                    wrapperClass: 'mb-3',
                  }}
                  selected={values.template}
                  onSelectChange={onTemplateSelected}
                  onBlurChange={() => {
                    setFieldTouched(template.name, true);
                    const value = values.template as IEmailTemplateAPI[];
                    if (value && value.length) {
                      setTemplate(value[0]);
                      return;
                    }
                    if (selectedTemplate && Number(selectedTemplate.id) > 0) {
                      setFieldValue('template', [selectedTemplate]);
                      return;
                    }
                  }}
                  isValid={touched.template && !errors.template}
                  isInvalid={touched.template && !!errors.template}
                  filterBy={['subject', 'body', 'recipient_type', 'individual_recipient_type']}
                  labelKey={'subject'}
                  renderMenuItemChildren={(option: Option) => {
                    const selected = option as IEmailTemplateAPI;
                    const recipient_type = selected.recipient_type.toLowerCase();
                    const individual_recipient_type = selected.individual_recipient_type
                      ? selected.individual_recipient_type.toLowerCase()
                      : '';

                    return (
                      <div>
                        <div className="fw-bold text-capitalize">
                          {recipient_type} <span className="mx-1">({individual_recipient_type})</span>
                        </div>
                        <div className="text-truncate small">{selected.subject}</div>
                        <div className="text-truncate small">{selected.body.replace(/(<([^>]+)>)/gi, '')}</div>
                      </div>
                    );
                  }}
                  searchIcon={false}
                  model_label="communication.EmailTemplate"
                  error={errors.template}
                  disabled={isRecordFetching}
                />
              </Col>
            </Row>
            <Row className="gy-3">
              <Col lg={8} md={10} className="mb-3">
                <p className="fw-medium text-primary">Recipients</p>
                <Row className="gy-1 gx-md-3 gx-2">
                  <Col md={3}>
                    <CustomSelect
                      name={recipient_type.name}
                      classNames={{ labelClass: 'fw-medium' }}
                      value={values.recipient_type}
                      onSelectChange={value => {
                        setFieldValue(recipient_type.name, value);
                        resetSelectedValues(units.name);
                        resetSelectedValues(tenants.name);
                        resetSelectedValues(owners.name);
                        resetSelectedValues(vendors.name);
                      }}
                      onBlurChange={() => setFieldTouched(recipient_type.name, true)}
                      isValid={touched.recipient_type && !errors.recipient_type}
                      isInvalid={touched.recipient_type && !!errors.recipient_type}
                      error={errors.recipient_type}
                      controlId="EmailFormRecipientType"
                      options={[
                        { label: 'Property', value: 'PROPERTY' },
                        { label: 'Individual', value: 'INDIVIDUAL' },
                      ]}
                      disabled={isRecordFetching}
                      placeholder="Recipient type"
                    />
                  </Col>
                  <Col md={3}>
                    <CustomSelect
                      classNames={{ labelClass: 'fw-medium' }}
                      name={individual_recipient_type.name}
                      value={values.individual_recipient_type}
                      onSelectChange={value => {
                        setFieldValue(individual_recipient_type.name, value);
                        resetSelectedValues(tenants.name);
                        resetSelectedValues(owners.name);
                        resetSelectedValues(vendors.name);
                      }}
                      onBlurChange={() => setFieldTouched(individual_recipient_type.name, true)}
                      isValid={touched.individual_recipient_type && !errors.individual_recipient_type}
                      isInvalid={touched.individual_recipient_type && !!errors.individual_recipient_type}
                      error={errors.individual_recipient_type}
                      controlId="EmailFormIndividualRecipientType"
                      options={[
                        { label: 'Owner', value: 'OWNER' },
                        { label: 'Tenant', value: 'TENANT' },
                        { label: 'Vendor', value: 'VENDOR' },
                      ]}
                      disabled={values.recipient_type !== 'INDIVIDUAL' || isRecordFetching}
                      placeholder="Tenant"
                    />
                  </Col>
                  <Col xs={12}>
                    {currentType === 'TENANT' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={tenants.name}
                        placeholder={`Search for tenants`}
                        controlId={`EmailFormTenants`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.tenants}
                        onSelectChange={onTenantSelected}
                        onBlurChange={() => setFieldTouched(tenants.name, true)}
                        isValid={touched.tenants && !errors.tenants}
                        isInvalid={touched.tenants && !!errors.tenants}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as ITenantAPI)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as ITenantAPI} />}
                        searchIcon={false}
                        error={errors.tenants}
                        model_label="people.Tenant"
                        disabled={tenantsLoading || tenantsFetching}
                      />
                    )}
                    {currentType === 'OWNER' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={owners.name}
                        placeholder={`Search for owners`}
                        controlId={`EmailFormOwners`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.owners}
                        onSelectChange={onOwnerSelected}
                        onBlurChange={() => setFieldTouched(owners.name, true)}
                        isValid={touched.owners && !errors.owners}
                        isInvalid={touched.owners && !!errors.owners}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as IOwner)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as IOwner} />}
                        searchIcon={false}
                        error={errors.owners}
                        model_label="people.Owner"
                        disabled={ownersLoading || ownersFetching}
                      />
                    )}
                    {currentType === 'VENDOR' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={vendors.name}
                        placeholder={`Search for vendors`}
                        controlId={`EmailFormVendor`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.vendors}
                        onSelectChange={onVendorSelected}
                        onBlurChange={() => setFieldTouched(vendors.name, true)}
                        isValid={touched.vendors && !errors.vendors}
                        isInvalid={touched.vendors && !!errors.vendors}
                        filterBy={['first_name', 'last_name']}
                        labelKey={option => getStringPersonName(option as IVendor)}
                        renderMenuItemChildren={option => <ItemMenuItem option={option as IVendor} />}
                        searchIcon={false}
                        error={errors.vendors}
                        model_label="people.Vendor"
                        disabled={vendorsLoading || vendorsFetching}
                      />
                    )}
                    {currentType === 'PROPERTY' && (
                      <FilterPaginateInput
                        multiple
                        size="sm"
                        name={units.name}
                        model_label="property.Unit"
                        controlId={`EmailFormUnitName`}
                        placeholder={`Select`}
                        classNames={{
                          labelClass: 'popup-form-labels',
                          wrapperClass: 'mb-3',
                        }}
                        selected={values.units}
                        onSelectChange={onUnitSelected}
                        onBlurChange={() => setFieldTouched(units.name, true)}
                        isValid={touched.units && !errors.units}
                        isInvalid={touched.units && !!errors.units}
                        labelKey={'name'}
                        disabled={unitsLoading || unitsFetching}
                        error={errors.units}
                      />
                    )}
                  </Col>
                </Row>
              </Col>
            </Row>

            <Row>
              <Form.Group as={Col} lg={8} md={10} className="mb-4" controlId="EmailsFormEmail">
                <Form.Label className="form-label-md">Subject</Form.Label>
                <Form.Control
                  type="text"
                  name={subject.name}
                  value={values.subject}
                  onBlur={handleBlur}
                  onChange={handleChange}
                  isValid={touched.subject && !errors.subject}
                  isInvalid={touched.subject && !!errors.subject}
                  placeholder="Add subject here"
                />
                <Form.Control.Feedback type="invalid">{errors.subject}</Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Row>
              <Form.Group as={Col} lg={8} md={10} controlId="SendEmailFormBody" className="mb-4">
                <Form.Label className="w-100">
                  <Stack direction="horizontal" gap={2} className="justify-content-between">
                    <span className="popup-form-labels flex-fill">Body</span>
                    <span className="text-muted small">(for attachments max file size allowed: 20 Mbs)</span>
                  </Stack>
                </Form.Label>
                <RichTextEditor
                  height={200}
                  id="SendEmailFormBody"
                  attachment={{
                    show: true,
                    handle: onAttachmentClick,
                  }}
                  value={values.body}
                  onChange={val => setFieldValue(body.name, val)}
                  onBlur={() => setFieldTouched(body.name, true)}
                  isValid={touched.body && !errors.body}
                  isInvalid={touched.body && !!errors.body}
                  error={errors.body}
                />
                <Dropzone
                  onDrop={onDrop}
                  name="attachments"
                  onError={error => setFieldError('attachments', error.message)}
                  accept={FILE_ALL_TYPES}
                  className="d-none"
                  maxSize={2e7}
                />
                <Row className="g-2 align-items-stretch justify-content-start">
                  {values.attachments.length > 0 &&
                    values.attachments.map((file, indx) => {
                      const currentFileProgress = progress.find(p =>
                        filesData.find(
                          f =>
                            f.unique_name === p.file_id &&
                            `${f.name}.${f.ext}`.toLowerCase() === file.name.toLowerCase()
                        )
                      );
                      const progressed =
                        currentFileProgress && currentFileProgress.progress ? currentFileProgress.progress : 0;

                      return (
                        <Col key={indx} lg={3} md={4} sm={6}>
                          <FileAttachments
                            minified
                            backgroundClass="bg-light bg-opacity-75"
                            onRemove={() => {
                              setFieldValue(
                                'attachments',
                                values.attachments.filter(value => value.name !== file.name)
                              );
                              setTotalFiles(prev => prev - 1);
                            }}
                            progress={progressed}
                            file={file}
                          ></FileAttachments>
                        </Col>
                      );
                    })}
                  <Form.Control.Feedback
                    type="invalid"
                    className={clsx({ 'd-block': touched.attachments && !!errors.attachments })}
                  >
                    {errors.attachments?.toString()}
                  </Form.Control.Feedback>
                </Row>
              </Form.Group>
            </Row>
            <Row>
              <Col xxl={4} lg={6} md={8}>
                <Signature
                  controlID="EmailsFormEmail1"
                  value={values.signature}
                  existing={values.existing_signature}
                  handleSignatureInput={(text, id) => {
                    setFieldValue(signature.name, text);
                    setFieldValue(existing_signature.name, id ? id : null);
                  }}
                  onBlur={() => setFieldTouched(signature.name, true)}
                  isValid={touched.signature && !errors.signature}
                  isInvalid={touched.signature && !!errors.signature}
                  readOnly={signatureLoading || signatureFetching || Boolean(values.existing_signature)}
                  error={errors.signature}
                />
              </Col>
            </Row>

            <Stack gap={3} direction="horizontal" className="justify-content-end mt-5 align-items-center">
              {isSubmitting && isUploading && <Spinner size="sm" />}
              <Button variant="light border-primary" className="px-4 py-1" type="reset" onClick={() => redirect(-1)}>
                Cancel
              </Button>
              <SubmitBtn
                variant="primary"
                type="submit"
                className="px-4 py-1"
                disabled={isSubmitting}
                loading={isSubmitting}
              >
                Create
              </SubmitBtn>
            </Stack>
          </Form>
        </Card.Body>
      </Card>
    </PageContainer>
  );
};

export default EmailCRUD;
