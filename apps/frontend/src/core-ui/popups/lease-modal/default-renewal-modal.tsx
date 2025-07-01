import { useCallback, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import {
  useCreateDefaultRenewalTemplateAttachmentsMutation,
  useDeleteDefaultRenewalTemplateAttachmentsMutation,
  useUpdatePropertiesInformationMutation,
} from 'services/api/properties';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getReadableError, renderFormError } from 'utils/functions';

import { ISingleLeaseTemplate } from 'interfaces/IApplications';
import { IFileInfo } from 'interfaces/IAttachments';
import { IPropertyAttachments, ISingleProperty } from 'interfaces/IProperties';

const DefaultRenewalTemplateSchema = Yup.object().shape({
  default_lease_renewal_template: yupFilterInput.required('This field is required!'),
  default_lease_renewal_agenda: Yup.string().trim(),
  files_included: Yup.array().of(Yup.object()).default([]),
  files: Yup.array()
    .of(Yup.mixed())
    .when('files_included', {
      is: (file: Array<IPropertyAttachments>) => file && file.length <= 0,
      then: schema => schema.of(Yup.mixed()),
    }),
});

interface IProps {
  property?: ISingleProperty;
  files: Array<IPropertyAttachments>;
  renewal_template?: ISingleLeaseTemplate;
}

const DefaultRenewalModal = ({ property, files, renewal_template }: IProps) => {
  const [updateRenewalLeaseTemplate] = useUpdatePropertiesInformationMutation();

  const [createAttachment] = useCreateDefaultRenewalTemplateAttachmentsMutation();
  const [deleteAttachment] = useDeleteDefaultRenewalTemplateAttachmentsMutation();

  const [deletedFiles, setDeletedFiles] = useState<IPropertyAttachments[]>([]);
  const {
    setTotalFiles,
    selectedFiles,
    setSelectedFiles,
    handleUpload,
    totalFiles,
    totalUploadProgress,
    totalFilesUpload,
    progress,
    filesData,
  } = useUploader('properties', 'lease-settings');

  const handleFormSubmission = async (values: Partial<ISingleProperty>) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = property && property.id ? Number(property.id) : -1;
    const response = await updateRenewalLeaseTemplate({ ...values, id: record_id }).unwrap();

    record_id = Number(response.id);
    const attachments = await handleAttachments(attachedFiles, record_id);
    const failedUploads = attachments.filter(result => result.error);
    await handleDeleteOldAttachments(deletedFiles);

    if (failedUploads.length <= 0) {
      return {
        data: response,
        feedback: `Record has been successfully added!`,
        status: 'success' as 'success' | 'warning',
      };
    }

    return {
      data: response,
      feedback: `${failedUploads.length}/${selectedFiles.length} files failed to upload. However, the record may have already been added!`,
      status: 'warning' as 'success' | 'warning',
    };
  };

  const handleAttachments = async (files: IFileInfo[], attachment__id: number) => {
    const attachments = files.map(result => ({
      name: result.name,
      file: result.unique_name,
      file_type: result.ext.toUpperCase(),
      parent_property: attachment__id,
    })) as Array<IPropertyAttachments>;

    const promises: Array<
      GenericMutationResult<Partial<IPropertyAttachments>, 'PropertyRenewalAttachments', IPropertyAttachments>
    > = [];

    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: IPropertyAttachments[]) => {
    const promises: Array<GenericMutationResult<string | number, 'PropertyRenewalAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deleteAttachment(Number(deleted.id))));
    }
    await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      default_lease_renewal_template: renewal_template ? [renewal_template] : ([] as Option[]),
      default_lease_renewal_agenda: property?.default_lease_renewal_agenda ?? '',
      files_included: files.length > 0 ? files : [],
      files: [] as Array<File>,
    },
    validationSchema: DefaultRenewalTemplateSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let renewal_template_id = 0;
      if (values.default_lease_renewal_template && values.default_lease_renewal_template.length > 0) {
        renewal_template_id = Number((values.default_lease_renewal_template as Array<ISingleLeaseTemplate>)[0].id);
      }

      const data: Partial<ISingleProperty> = {
        ...values,
        default_lease_renewal_template: renewal_template_id,
        default_lease_renewal_letter_template: renewal_template_id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          SwalExtended.close({ isConfirmed: true, value: Number(result.data.id) });
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
          SwalExtended.hideLoading();
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
    handleReset,
    handleBlur,
    errors,
  } = formik;

  const onLeaseTemplateSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('default_lease_renewal_template', selected);
      } else {
        setFieldValue('default_lease_renewal_template', []);
      }
    },
    [setFieldValue]
  );

  const onDrop = (acceptedFiles: Array<File>) => {
    if (acceptedFiles.length) {
      let files = acceptedFiles;
      if (values.files && Array.isArray(values.files)) {
        const initialValue = values.files as File[];
        files = [...files, ...initialValue];
        files = files.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
      }

      setSelectedFiles(files);
      setFieldValue('files', files);
      setTotalFiles(files.length);
    }
  };

  const handleFileRemoval = (file: IPropertyAttachments) => {
    const _files = values.files_included.filter(value => {
      if (value.name === file.name) {
        setDeletedFiles(prev => [...prev, file]);
      }
      return value.name !== file.name;
    });

    setFieldValue('files_included', _files);
  };

  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));
  return (
    <Popup
      title={'Default Renewal template'}
      subtitle={'Update renewal template information'}
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting}
      onReset={handleReset}
      progress={{
        uploaded: totalFilesUpload,
        progress: currentProgress && currentProgress.progress ? currentProgress.progress : 0,
        total: totalFiles,
        show: Boolean(values.files.length > 0),
        totalProgress: totalUploadProgress,
      }}
    >
      <Row className="gy-md-0 gy-3 gx-md-4 gx-sm-1 gx-0">
        <Col xxl={7} md={6}>
          <div className="text-start">
            <FilterPaginateInput
              name="default_lease_renewal_template"
              labelText="Select Lease Template"
              controlId={`DefaultLeaseFormTemplate`}
              placeholder={`Search Lease Template`}
              autoFocus
              classNames={{
                labelClass: 'popup-form-labels',
                wrapperClass: 'mb-4',
              }}
              selected={values.default_lease_renewal_template}
              onSelectChange={onLeaseTemplateSelected}
              onBlurChange={() => setFieldTouched('default_lease_renewal_template', true)}
              isValid={touched.default_lease_renewal_template && !errors.default_lease_renewal_template}
              isInvalid={touched.default_lease_renewal_template && !!errors.default_lease_renewal_template}
              model_label="lease.LeaseTemplate"
              labelKey={'name'}
              error={errors.default_lease_renewal_template}
            />
            <Form.Group controlId="DefaultRenewalFormAgenda">
              <Form.Label className="popup-form-labels">Agenda</Form.Label>
              <Form.Control
                placeholder="Some test here..."
                as="textarea"
                rows={5}
                name="default_lease_renewal_agenda"
                value={values.default_lease_renewal_agenda}
                onChange={handleChange}
                onBlur={handleBlur}
                isValid={touched.default_lease_renewal_agenda && !errors.default_lease_renewal_agenda}
                isInvalid={touched.default_lease_renewal_agenda && !!errors.default_lease_renewal_agenda}
              />
              <Form.Control.Feedback type="invalid">{errors.default_lease_renewal_agenda}</Form.Control.Feedback>
            </Form.Group>
          </div>
        </Col>
        <Col xxl={5} md={6}>
          <Form.Group controlId="RenewalFormAttachment">
            <div className="ratio ratio-4x3">
              <Dropzone
                onDrop={onDrop}
                accept={FILE_TYPES_DOCS_IMAGES}
                name="files"
                maxSize={5242880}
                onError={error => setFieldError('files', error.message)}
              />
            </div>
            <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': touched.files && !!errors.files })}>
              {errors.files?.toString()}
            </Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="gx-0 align-items-stretch justify-content-end">
        {values.files &&
          values.files.length > 0 &&
          values.files.map((file, indx) => {
            const currentFileProgress = progress.find(p =>
              filesData.find(
                f => f.unique_name === p.file_id && `${f.name}.${f.ext}`.toLowerCase() === file.name.toLowerCase()
              )
            );
            const progressed = currentFileProgress && currentFileProgress.progress ? currentFileProgress.progress : 0;
            return (
              <Col key={indx} lg={4} md={6}>
                <FileAttachments
                  onRemove={() => {
                    const remainingFiles = values.files.filter(value => value.name !== file.name);
                    setSelectedFiles(remainingFiles);
                    setFieldValue('files', remainingFiles);
                    setTotalFiles(remainingFiles.length);
                  }}
                  progress={progressed}
                  file={file}
                />
              </Col>
            );
          })}
        {values.files_included &&
          values.files_included.length > 0 &&
          values.files_included.map((file, indx) => (
            <Col key={indx} lg={4} md={6}>
              <FileAttachments onRemove={() => handleFileRemoval(file)} file={file} />
            </Col>
          ))}
      </Row>
    </Popup>
  );
};

export default ProviderHOC(DefaultRenewalModal);
