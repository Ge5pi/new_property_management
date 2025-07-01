import { useCallback } from 'react';
import { Col, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';

import { useCreateEmailSignatureMutation } from 'services/api/email-signature';
import { useCreateEmailMutation } from 'services/api/emails';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { Popup } from 'components/popup';
import { Signature } from 'components/signature';

import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { RichTextEditor } from 'core-ui/text-editor';
import { Notify } from 'core-ui/toast';

import { useUploader } from 'hooks/useUploader';

import { FILE_ALL_TYPES } from 'constants/file-types';
import { getReadableError, renderFormError } from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IEmails } from 'interfaces/ICommunication';

import formFields from './form-fields';
import formValidation from './form-validation';

interface IEmailProps {
  vendor_id: number | string;
}

const SendEmail = ({ vendor_id }: IEmailProps) => {
  const { subject, body, signature, existing_signature } = formFields;

  const [createEmail] = useCreateEmailMutation();
  const [createSignature] = useCreateEmailSignatureMutation();

  const {
    setTotalFiles,
    selectedFiles,
    setSelectedFiles,
    handleUpload,
    progress,
    filesData,
    isUploading,
    totalFilesUpload,
    totalFiles,
    totalUploadProgress,
  } = useUploader('emails');

  const handleFormSubmission = async (
    values: Omit<IEmails, 'attachments' | 'signature'>,
    signature?: string | number
  ) => {
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
      feedback: `Email has been sent to the vendor`,
      status: 'success' as 'success' | 'warning',
    };
  };

  const {
    touched,
    errors,
    handleSubmit,
    handleReset,
    isSubmitting,
    values,
    setFieldValue,
    handleChange,
    setFieldTouched,
    setFieldError,
    handleBlur,
  } = useFormik({
    initialValues: {
      subject: '',
      body: '',
      signature: '',
      existing_signature: null,
      attachments: [] as File[],
    },
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

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
        vendors: [vendor_id],
        recipient_type: 'INDIVIDUAL',
        individual_recipient_type: 'VENDOR',
      } as Omit<IEmails, 'attachments' | 'signature'>;

      handleFormSubmission(data, signature)
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
    validationSchema: formValidation,
  });

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
        setFieldValue('attachments', files);
        setTotalFiles(files.length);
      }
    },
    [setTotalFiles, setFieldValue, setSelectedFiles, values.attachments]
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
  const currentProgress = progress.find(p => filesData.find(f => f.unique_name === p.file_id));

  return (
    <Popup
      title="Send Email"
      subtitle="compose email that you want to send to this vendor"
      successButton="Send"
      onSubmit={handleSubmit}
      isSubmitting={isSubmitting && isUploading}
      onReset={handleReset}
      progress={{
        uploaded: totalFilesUpload,
        progress: currentProgress && currentProgress.progress ? currentProgress.progress : 0,
        total: totalFiles,
        show: Boolean(values.attachments.length > 0),
        totalProgress: totalUploadProgress,
      }}
    >
      <Form.Group className="mb-4" controlId="EmailsFormEmail">
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
      <Form.Group controlId="SendEmailFormBody" className="mb-4">
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
        <Row className="gx-2 align-items-stretch justify-content-start">
          {values.attachments.length > 0 &&
            values.attachments.map((file, indx) => {
              const currentFileProgress = progress.find(p =>
                filesData.find(
                  f => f.unique_name === p.file_id && `${f.name}.${f.ext}`.toLowerCase() === file.name.toLowerCase()
                )
              );
              const progressed = currentFileProgress && currentFileProgress.progress ? currentFileProgress.progress : 0;

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
      <Row>
        <Col lg={6} md={8}>
          <Signature
            useImage={false}
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
            readOnly={Boolean(values.existing_signature)}
            error={errors.signature}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(SendEmail);
