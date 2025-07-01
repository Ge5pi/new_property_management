import { useCallback, useState } from 'react';
import { Button, Col, Form, Row, Spinner, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetBankAccountByIdQuery } from 'services/api/bank-accounts';
import {
  useCreatePaymentsAttachmentsMutation,
  useDeletePaymentsAttachmentsMutation,
  useGetPaymentsAttachmentsQuery,
} from 'services/api/payments';
import { useMarkTenantInvoiceAsPaidMutation } from 'services/api/tenants/accounts';
import { useCreateTenantPaymentsMutation, useUpdateTenantPaymentsMutation } from 'services/api/tenants/payments';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { InputDate } from 'core-ui/input-date';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';
import { getIDFromObject, getReadableError, renderFormError } from 'utils/functions';

import { IBankAccounts, ITenantPaymentAttachments, ITenantPayments, TenantPaymentType } from 'interfaces/IAccounting';
import { IFileInfo } from 'interfaces/IAttachments';

const ServiceReqSchema = Yup.object().shape({
  payment_date: Yup.date()
    .required('Please enter a valid amount')
    .test('payment_date', 'Payment date must be smaller than today', value => {
      const curr = new Date();
      curr.setHours(0, 0, 0, 0);
      return value ? new Date(value) <= curr : true;
    }),
  remarks: Yup.string().trim(),
  account: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .required('this field is required!')
    .min(1, 'this field is required!'),
  files: Yup.array()
    .of(Yup.mixed())
    .required('this field is required!')
    .min(1, 'Please add at least 1 attachment to verify your payment'),
});

interface IProps {
  amount: number;
  invoice_id: number;
  tenant_payment?: ITenantPayments;
  update?: boolean;
}

const PaymentWithBank = ({ update, tenant_payment, amount, invoice_id }: IProps) => {
  const { redirect } = useRedirect();
  const {
    data: account_data,
    isLoading: accountsLoading,
    isFetching: accountsFetching,
  } = useGetBankAccountByIdQuery(getIDFromObject('account', tenant_payment));

  const {
    data: payment_attachments,
    isLoading: requestAttachmentsLoading,
    isFetching: requestAttachmentsFetching,
  } = useGetPaymentsAttachmentsQuery(getIDFromObject('id', tenant_payment));

  const [updatePayment] = useUpdateTenantPaymentsMutation();
  const [createPayment] = useCreateTenantPaymentsMutation();

  const [markAsPaid] = useMarkTenantInvoiceAsPaidMutation();

  const [deletedFiles, setDeletedFiles] = useState<ITenantPaymentAttachments[]>([]);
  const { selectedFiles, setSelectedFiles, handleUpload, progress, filesData, isUploading } = useUploader('payments');

  const [createPaymentAttachment] = useCreatePaymentsAttachmentsMutation();
  const [deletePaymentAttachment] = useDeletePaymentsAttachmentsMutation();

  const handleFormSubmission = async (values: ITenantPayments) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = tenant_payment && tenant_payment.id ? Number(tenant_payment.id) : -1;
    const response =
      update && record_id > 0
        ? await updatePayment({ ...values, id: record_id }).unwrap()
        : await createPayment(values).unwrap();

    record_id = Number(response.id);

    const attachments = await handleAttachments(attachedFiles, record_id);
    const failedUploads = attachments.filter(result => result.error);

    await markAsPaid({ invoice: invoice_id, payment: record_id }).unwrap();
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
      payment: attachment__id,
    })) as Array<ITenantPaymentAttachments>;

    const promises: Array<
      GenericMutationResult<ITenantPaymentAttachments, 'PaymentsAttachments', ITenantPaymentAttachments>
    > = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createPaymentAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: ITenantPaymentAttachments[]) => {
    const promises: Array<GenericMutationResult<ITenantPaymentAttachments, 'PaymentsAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deletePaymentAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  const formik = useFormik({
    initialValues: {
      payment_date: tenant_payment?.payment_date ?? new Date().toISOString().split('T')[0],
      remarks: tenant_payment?.remarks ?? '',
      notes: tenant_payment?.notes ?? '',
      account: account_data ? [account_data] : ([] as Option[]),
      payment_method: tenant_payment?.payment_method ?? ('BANK_TRANSFER' as TenantPaymentType),
      old_files: payment_attachments ? payment_attachments : ([] as ITenantPaymentAttachments[]),
      files: [] as File[],
    },
    validationSchema: ServiceReqSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      let account_id = 0;
      if (values.account && values.account.length > 0) {
        account_id = Number((values.account as Array<IBankAccounts>)[0].id);
      }

      if (!invoice_id || !amount || !account_id) {
        Notify.show({ type: 'warning', title: 'Invalid details provided. Please check your account' });
        setSubmitting(false);
        return;
      }

      const data: ITenantPayments = {
        ...values,
        amount,
        invoice: invoice_id,
        payment_method: 'BANK_TRANSFER',
        account: account_id,
      };

      handleFormSubmission(data)
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          redirect(`/payments/details/${result.data.id}`, true, 'payments');
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

  const handleRemoveCurrentFiles = (file: ITenantPaymentAttachments, current: ITenantPaymentAttachments[]) => {
    const removedFile = current.find(cur => cur.name === file.name);
    const remainingFiles = current.filter(cur => cur.name !== file.name);

    setFieldValue('old_files', remainingFiles);
    setDeletedFiles(prev => {
      if (removedFile) prev.push(removedFile);
      return prev;
    });
  };

  const onAccountSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('account', selected);
      } else {
        setFieldValue('account', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Form noValidate onSubmit={handleSubmit}>
      <Row className="gx-0 gy-3 border-top mt-3 pt-3">
        <Col xxl={6} lg={7} xs={12}>
          <div>
            <Row className="gx-1 gy-3">
              <Col xxl={6} lg={7} md={6}>
                <FilterPaginateInput
                  name="account"
                  model_label="accounting.Account"
                  labelText="Bank Account"
                  controlId={`PaymentFormBankAccount`}
                  placeholder={`Search`}
                  classNames={{
                    labelClass: 'popup-form-labels',
                    wrapperClass: 'mb-3',
                  }}
                  filterBy={['account_number', 'account_title']}
                  searchIcon={false}
                  selected={values.account}
                  onSelectChange={onAccountSelected}
                  onBlurChange={() => setFieldTouched('account', true)}
                  isValid={touched.account && !errors.account}
                  isInvalid={touched.account && !!errors.account}
                  labelKey={'account_title'}
                  renderMenuItemChildren={(option: Option) => (
                    <div className="small row gx-0">
                      <div className="col-6">
                        <div className="fw-bold text-uppercase">{(option as IBankAccounts).account_title}</div>
                        <div className="text-truncate small">{(option as IBankAccounts).account_number}</div>
                      </div>
                      <div className="col-6">
                        <div className="text-uppercase">{(option as IBankAccounts).bank_name}</div>
                        <div className="text-truncate small">
                          {(option as IBankAccounts).branch_code} | {(option as IBankAccounts).branch_name}
                        </div>
                      </div>
                    </div>
                  )}
                  disabled={accountsLoading || accountsFetching}
                  error={errors.account}
                />
              </Col>
              <Col xxl={6} lg={7} md={6}>
                <InputDate
                  maxDate={new Date()}
                  name={'payment_date'}
                  labelText={'Payment Date'}
                  controlId="PaymentFormPaymentDate"
                  classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
                  value={values.payment_date}
                  onDateSelection={date => setFieldValue('payment_date', date)}
                  onBlur={() => setFieldTouched('payment_date', true)}
                  isValid={touched.payment_date && !errors.payment_date}
                  isInvalid={touched.payment_date && !!errors.payment_date}
                  error={errors.payment_date}
                />
              </Col>
              <Col xxl={8} lg={9} md={8}>
                <Form.Group className="mb-4" controlId="PaymentFormRemarks">
                  <Form.Label className="popup-form-labels">Remarks</Form.Label>
                  <Form.Control
                    placeholder="Some test here..."
                    as="textarea"
                    rows={5}
                    name="remarks"
                    value={values.remarks}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    isValid={touched.remarks && !errors.remarks}
                    isInvalid={touched.remarks && !!errors.remarks}
                  />
                  <Form.Control.Feedback type="invalid">{errors.remarks}</Form.Control.Feedback>
                </Form.Group>
              </Col>
            </Row>
          </div>
        </Col>
        <Col lg xs={12}>
          <div className="ps-lg-3 ps-0">
            <div>
              <Row className="mb-4 gx-0 gy-2">
                <Col xs={12}>
                  <Form.Group controlId="NotesFormAttachments">
                    <Form.Label className="popup-form-labels">Attachments</Form.Label>
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
            </div>
          </div>
        </Col>
        <Col xs={12}>
          <Stack gap={1} direction="horizontal" className="justify-content-end mt-5 align-items-center">
            {isSubmitting && isUploading && <Spinner size="sm" />}
            <Button type="reset" variant="light border-primary" onClick={() => redirect(-1)} className="px-4 py-1 me-3">
              Cancel
            </Button>

            <SubmitBtn type="submit" variant="success" loading={isSubmitting} className="px-5 py-1">
              Pay
            </SubmitBtn>
          </Stack>
        </Col>
      </Row>
    </Form>
  );
};

export default PaymentWithBank;
