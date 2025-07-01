import { useState } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import {
  useCreateBankAccountAttachmentsMutation,
  useDeleteBankAccountAttachmentsMutation,
  useDeleteBankAccountMutation,
  useGetBankAccountAttachmentsQuery,
  useGetBankAccountByIdQuery,
  useUpdateBankAccountMutation,
} from 'services/api/bank-accounts';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { Attachments } from 'components/attachments';
import { BackButton } from 'components/back-button';
import { Notes } from 'components/notes';
import PageContainer from 'components/page-container';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { IBankAccountAttachments } from 'interfaces/IAccounting';
import { IAttachments } from 'interfaces/IAttachments';

const BankAccountsDetails = () => {
  const { redirect } = useRedirect();
  const { account_id } = useParams();

  const bank_account = useGetBankAccountByIdQuery(getValidID(account_id));

  const [
    deleteBankAccountByID,
    { isSuccess: isDeleteBankAccountSuccess, isError: isDeleteBankAccountError, error: deleteBankAccountError },
  ] = useDeleteBankAccountMutation();

  useResponse({
    isSuccess: isDeleteBankAccountSuccess,
    successTitle: 'You have deleted account details',
    isError: isDeleteBankAccountError,
    error: deleteBankAccountError,
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
        deleteBankAccountByID(id)
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

  // update account
  const [
    updateAccount,
    { isSuccess: isUpdateAccountSuccess, isError: isUpdateAccountError, error: accountUpdateError },
  ] = useUpdateBankAccountMutation();

  useResponse({
    isSuccess: isUpdateAccountSuccess,
    successTitle: 'Bank Account details has been successfully updated!',
    isError: isUpdateAccountError,
    error: accountUpdateError,
  });

  const handleNoteSubmit = async (value: string) => {
    if (!isNaN(Number(account_id)) && Number(account_id) > 0) {
      updateAccount({ notes: value, id: Number(account_id) });
    }
  };

  return (
    <ApiResponseWrapper
      {...bank_account}
      renderResults={data => {
        return (
          <PageContainer>
            <Stack className="justify-content-between flex-wrap mb-3" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">Account Details</h1>
              </div>
              {Number(data.id) > 0 && (
                <Stack direction="horizontal" gap={1}>
                  <DeleteBtn
                    disabled={disabled}
                    permission={PERMISSIONS.ACCOUNTS}
                    onClick={() => data.id && deleteRecord(data.id)}
                    showText
                  />
                  <EditBtn
                    disabled={disabled}
                    permission={PERMISSIONS.ACCOUNTS}
                    onClick={() => redirect(`/bank-accounts/${data.id}/modify`, false, 'bank-accounts')}
                    showText
                  />
                </Stack>
              )}
            </Stack>

            <Card className="border-0 p-4 page-section my-3">
              <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                <div>
                  <p className="fw-bold m-0 text-primary">Account Details</p>
                  <p>This sections includes all the information regarding this account</p>
                </div>
              </Card.Header>
              <Card.Body className="p-0">
                <Row className="gx-3 gy-4">
                  <Col md={4} sm={6}>
                    <RenderInformation title="Account Name" description={data.account_title} />
                  </Col>
                  <Col md={4} sm={6}>
                    <RenderInformation title="Account Number" description={data.account_number} />
                  </Col>
                  <Col md={4} sm={6}>
                    <RenderInformation title="IBAN" description={data.iban} />
                  </Col>
                </Row>

                <Row className="gx-3 gy-4">
                  <Col md={4} sm={6}>
                    <RenderInformation title="Bank Name" description={data.bank_name} />
                  </Col>
                  <Col md={4} sm={6}>
                    <RenderInformation title="Branch Name" description={data.branch_name} />
                  </Col>
                  <Col md={4} sm={6}>
                    <RenderInformation title="Branch Code" description={data.branch_code} />
                  </Col>
                </Row>

                <Row className="gx-3 gy-3">
                  <Col sm={6}>
                    <RenderInformation title="Address" description={data.address} />
                  </Col>
                </Row>
                <Row className="gx-3 gy-3">
                  <Col sm={6}>
                    <RenderInformation title="Description" description={data.description} />
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <div className="container-fluid page-section my-4">
              <Row className="mt-1 g-0 align-items-stretch">
                <Col xs={12}>
                  <Card className="border-0">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Notes</p>
                      <span className="small text-muted">
                        Write down all relevant information and quick notes for your help over here
                      </span>
                    </Card.Header>
                    <Card.Body className="px-2 text-start pt-0 pb-4">
                      <Notes
                        initialValue={data.notes}
                        onNoteSubmit={handleNoteSubmit}
                        controlID={'PropertyNoteInput'}
                        label={'Notes'}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <BankAccountAttachments />
          </PageContainer>
        );
      }}
    />
  );
};

export default BankAccountsDetails;

const BankAccountAttachments = () => {
  const { account_id } = useParams();

  // create attachment
  const [
    createBankAccountAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: attachmentError },
  ] = useCreateBankAccountAttachmentsMutation();

  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: attachmentError,
  });

  const [
    deleteBankAccountAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeleteBankAccountAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as IBankAccountAttachments;
    if (attachment.id && attachment.account) {
      await deleteBankAccountAttachments(attachment);
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (account_id && Number(account_id) > 0) {
      return await createBankAccountAttachments({ ...data, account: Number(account_id) });
    }
    return Promise.reject('Incomplete data found');
  };

  // get rental attachments
  const attachments = useGetBankAccountAttachmentsQuery(getValidID(account_id));

  return (
    <div className="shadow page-section mb-3">
      <Attachments
        {...attachments}
        onDelete={handleAttachmentDelete}
        onUpload={handleAttachmentUpload}
        uploadPermission={PERMISSIONS.ACCOUNTS}
        deletePermission={PERMISSIONS.ACCOUNTS}
        uploadInfo={{ folder: 'attachments', module: 'bank-accounts' }}
      />
    </div>
  );
};
