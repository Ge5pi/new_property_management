import { useCallback, useState } from 'react';
import { Button, Card, Col, Form, Row, Spinner, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import {
  useCreateBankAccountAttachmentsMutation,
  useCreateBankAccountMutation,
  useDeleteBankAccountAttachmentsMutation,
  useGetBankAccountAttachmentsQuery,
  useUpdateBankAccountMutation,
} from 'services/api/bank-accounts';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';

import { BackButton } from 'components/back-button';
import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { NotesControl } from 'components/notes';
import PageContainer from 'components/page-container';
import { SubmitBtn } from 'components/submit-button';

import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, renderFormError } from 'utils/functions';

import { IBankAccountAttachments, IBankAccounts } from 'interfaces/IAccounting';
import { IFileInfo } from 'interfaces/IAttachments';

const bankAccountSchema = Yup.object().shape({
  bank_name: Yup.string().trim().required(`this field is required!`).max(65, 'maximum characters allowed: 65'),
  branch_name: Yup.string().trim().required('this field is required!'),
  branch_code: Yup.string().trim().required('this field is required!'),
  account_title: Yup.string().trim().required('this field is required!'),
  account_number: Yup.string().trim().required('this field is required!').max(50, 'maximum characters allowed: 50'),
  iban: Yup.string().trim().required('this field is required!').max(50, 'maximum characters allowed: 50'),

  address: Yup.string().trim(),
  description: Yup.string().trim(),
  notes: Yup.string().trim(),
});

interface IProps {
  account?: IBankAccounts;
  update?: boolean;
}

const BankAccountsForm = ({ account, update }: IProps) => {
  const { redirect } = useRedirect();

  const {
    data: bank_attachments,
    isLoading: bankAttachmentsLoading,
    isFetching: bankAttachmentsFetching,
  } = useGetBankAccountAttachmentsQuery(getIDFromObject('id', account));

  const [createAccount] = useCreateBankAccountMutation();
  const [updateAccount] = useUpdateBankAccountMutation();

  const [createBankAccountAttachment] = useCreateBankAccountAttachmentsMutation();
  const [deleteBankAccountAttachment] = useDeleteBankAccountAttachmentsMutation();

  const [deletedFiles, setDeletedFiles] = useState<IBankAccountAttachments[]>([]);
  const { selectedFiles, setSelectedFiles, handleUpload, progress, filesData, isUploading } =
    useUploader('bank-accounts');

  const handleFormSubmission = async (values: IBankAccounts) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = account && account.id ? Number(account.id) : -1;
    const response =
      update && record_id > 0
        ? await updateAccount({ ...values, id: record_id }).unwrap()
        : await createAccount(values).unwrap();

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
      account: attachment__id,
    })) as Array<IBankAccountAttachments>;

    const promises: Array<
      GenericMutationResult<IBankAccountAttachments, 'BankAccountsAttachments', IBankAccountAttachments>
    > = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createBankAccountAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: IBankAccountAttachments[]) => {
    const promises: Array<GenericMutationResult<IBankAccountAttachments, 'BankAccountsAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deleteBankAccountAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  const {
    touched,
    errors,
    handleSubmit,
    isSubmitting,
    handleChange,
    handleBlur,
    values,
    setFieldValue,
    setFieldError,
  } = useFormik({
    enableReinitialize: true,
    initialValues: {
      iban: account?.iban ?? '',
      bank_name: account?.bank_name ?? '',
      branch_name: account?.branch_name ?? '',
      branch_code: account?.branch_code ?? '',
      account_title: account?.account_title ?? '',
      account_number: account?.account_number ?? '',
      description: account?.description ?? '',
      address: account?.address ?? '',
      notes: account?.notes ?? '',
      old_files: bank_attachments ? bank_attachments : ([] as IBankAccountAttachments[]),
      files: [] as File[],
    },
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      handleFormSubmission(values)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          redirect(`/bank-accounts/${result.data.id}/details`, true, 'bank-accounts');
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
    validationSchema: bankAccountSchema,
  });

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
    [setFieldValue, setSelectedFiles, values.files]
  );

  const handleRemoveCurrentFiles = (file: IBankAccountAttachments, current: IBankAccountAttachments[]) => {
    const removedFile = current.find(cur => cur.name === file.name);
    const remainingFiles = current.filter(cur => cur.name !== file.name);

    setFieldValue('old_files', remainingFiles);
    setDeletedFiles(prev => {
      if (removedFile) prev.push(removedFile);
      return prev;
    });
  };

  return (
    <PageContainer>
      <Form noValidate onSubmit={handleSubmit}>
        <Stack className="align-items-center justify-content-between mb-3" direction="horizontal">
          <div>
            <BackButton />
            <h1 className="fw-bold h4 mb-0">{update ? 'Update Account Details' : 'Create New Account'}</h1>
          </div>
          <div>
            <Stack gap={3} direction="horizontal" className="justify-content-end mt-5 align-items-center">
              {isSubmitting && isUploading && <Spinner size="sm" />}
              <Button type="reset" variant="light border-primary" className="px-4 py-1" onClick={() => redirect(-1)}>
                Cancel
              </Button>
              <SubmitBtn
                type="submit"
                loading={isSubmitting}
                disabled={isSubmitting}
                variant="primary"
                className="px-4 py-1"
              >
                {update ? 'Update' : 'Create'}
              </SubmitBtn>
            </Stack>
          </div>
        </Stack>

        <Card className="border-0 p-4 page-section mb-3">
          <Card.Header className="border-0 p-0 bg-transparent text-start">
            <div>
              <p className="fw-bold m-0 text-primary">{update ? 'Update Account Form' : 'New Account Form'}</p>
              <p className="small">Provide information regarding the account</p>
            </div>
          </Card.Header>

          <Card.Body className="p-0 mt-4">
            <Row>
              <Col md={6}>
                <Row className="gx-1 gy-3">
                  <Form.Group as={Col} xs={12} className="mb-4" controlId="BankFormTitle">
                    <Form.Label className="form-label-md">Bank Name</Form.Label>
                    <Form.Control
                      autoFocus
                      type="text"
                      name="bank_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.bank_name}
                      isValid={touched.bank_name && !errors.bank_name}
                      isInvalid={touched.bank_name && !!errors.bank_name}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.bank_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} md={4} className="mb-4" controlId="BankBranchFormCode">
                    <Form.Label className="form-label-md">Branch Code</Form.Label>
                    <Form.Control
                      type="text"
                      name="branch_code"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.branch_code}
                      isValid={touched.branch_code && !errors.branch_code}
                      isInvalid={touched.branch_code && !!errors.branch_code}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.branch_code}</Form.Control.Feedback>
                  </Form.Group>
                  <Form.Group as={Col} md={8} className="mb-4" controlId="BankBranchFormName">
                    <Form.Label className="form-label-md">Branch Name</Form.Label>
                    <Form.Control
                      type="text"
                      name="branch_name"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.branch_name}
                      isValid={touched.bank_name && !errors.branch_name}
                      isInvalid={touched.branch_name && !!errors.branch_name}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.branch_name}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xxl={6} className="mb-4" controlId="AccountFormName">
                    <Form.Label className="form-label-md">Account Title</Form.Label>
                    <Form.Control
                      type="text"
                      name="account_title"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.account_title}
                      isValid={touched.account_title && !errors.account_title}
                      isInvalid={touched.account_title && !!errors.account_title}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.account_title}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xxl={6} className="mb-4" controlId="BankAccountFormNumber">
                    <Form.Label className="form-label-md">Account Number</Form.Label>
                    <Form.Control
                      type="number"
                      name="account_number"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.account_number}
                      isValid={touched.account_number && !errors.account_number}
                      isInvalid={touched.account_number && !!errors.account_number}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.account_number}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Col>
              <Col md={6}>
                <Row className="gx-1 gy-3">
                  <Form.Group as={Col} lg={8} className="mb-4" controlId="BankAccountFormIBAN">
                    <Form.Label className="form-label-md">IBAN</Form.Label>
                    <Form.Control
                      type="text"
                      name="iban"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      value={values.iban}
                      isValid={touched.iban && !errors.iban}
                      isInvalid={touched.iban && !!errors.iban}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.iban}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} className="mb-4" controlId="BankAccountFormAddress">
                    <Form.Label className="form-label-md">Address</Form.Label>
                    <Form.Control
                      as="textarea"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="address"
                      isValid={touched.address && !errors.address}
                      isInvalid={touched.address && !!errors.address}
                      value={values.address}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.address}</Form.Control.Feedback>
                  </Form.Group>

                  <Form.Group as={Col} xs={12} className="mb-4" controlId="BankAccountFormDescription">
                    <Form.Label className="form-label-md">Description</Form.Label>
                    <Form.Control
                      as="textarea"
                      onBlur={handleBlur}
                      onChange={handleChange}
                      name="description"
                      isValid={touched.description && !errors.description}
                      isInvalid={touched.description && !!errors.description}
                      value={values.description}
                      placeholder="Type here"
                    />
                    <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                  </Form.Group>
                </Row>
              </Col>
            </Row>

            <Row>
              <Col lg={6} md={8}>
                <Form.Group controlId="BankFormAttachments">
                  <Form.Label className="form-label-md">Attachments</Form.Label>
                  <div className="ratio ratio-21x9">
                    <Dropzone
                      name="files"
                      onDrop={onDrop}
                      disabled={bankAttachmentsFetching || bankAttachmentsLoading}
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
                    name="notes"
                    onBlur={handleBlur}
                    value={values.notes}
                    onChange={handleChange}
                    isValid={touched.notes && !errors.notes}
                    isInvalid={touched.notes && !!errors.notes}
                  />
                  <Form.Control.Feedback
                    type="invalid"
                    className={clsx({ 'd-block': touched.notes && !!errors.notes })}
                  >
                    {errors.notes}
                  </Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </Form>
    </PageContainer>
  );
};

export default BankAccountsForm;
