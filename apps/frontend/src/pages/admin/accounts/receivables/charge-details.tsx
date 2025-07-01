import { useState } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import {
  useCreateChargeAttachmentsMutation,
  useDeleteChargeAttachmentsMutation,
  useDeleteChargeMutation,
  useGetChargeAttachmentsQuery,
  useGetChargeByIdQuery,
} from 'services/api/charges';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { Attachments } from 'components/attachments';
import { BackButton } from 'components/back-button';
import { Log } from 'components/log';
import PageContainer from 'components/page-container';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Avatar } from 'core-ui/user-avatar';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

import { IChargeAttachments } from 'interfaces/IAccounting';
import { IAttachments } from 'interfaces/IAttachments';

const ChargeDetails = () => {
  const { redirect } = useRedirect();
  const { charge: charge_id } = useParams();
  const charge = useGetChargeByIdQuery(getValidID(charge_id));

  const [
    deleteChargeByID,
    { isSuccess: isDeleteChargeSuccess, isError: isDeleteChargeError, error: deleteChargeError },
  ] = useDeleteChargeMutation();

  useResponse({
    isSuccess: isDeleteChargeSuccess,
    successTitle: 'You have deleted a charge',
    isError: isDeleteChargeError,
    error: deleteChargeError,
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
        deleteChargeByID(id)
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

  return (
    <ApiResponseWrapper
      {...charge}
      renderResults={data => {
        return (
          <PageContainer>
            <Stack className="justify-content-between flex-wrap mb-3" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">
                  Charges <span className="text-uppercase">{data.slug}</span>
                </h1>
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
                    onClick={() => redirect(`/charges/${data.id}/modify`, false, 'charges')}
                    showText
                  />
                </Stack>
              )}
            </Stack>

            <Card className="border-0 py-2 page-section mb-4">
              <Card.Body className="px-4">
                <div className="mb-4">
                  <h2 className="fs-5 fw-bold text-primary mb-0">{data.title}</h2>
                  <p>{data.get_charge_type_display}</p>
                </div>

                <Row className="mb-3">
                  <Col xs={12} md={8} className="border-end">
                    <Row>
                      <Col xs={12}>
                        <RenderInformation title="Charge date" date={data.created_at} />
                      </Col>
                      <Col xs={12} md={4}>
                        <RenderInformation title="Property" description={data.property_name} />
                      </Col>
                      <Col xs={12} md={4}>
                        <RenderInformation title="Unit" description={data.unit_name} />
                      </Col>
                      <Col xs={12}>
                        <RenderInformation
                          title="Payer (Tenant name)"
                          html={
                            <Avatar
                              name={`${data.tenant_first_name} ${data.tenant_last_name}`}
                              showName={true}
                              size={30}
                            />
                          }
                        />
                      </Col>
                      <Col xs={12} md={10}>
                        <RenderInformation title="Description" description={data.description} />
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            <Card className="border-0 page-section mb-3">
              <Card.Header className="border-0 pt-3 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Notes</p>
              </Card.Header>
              <Card.Body className="text-start pt-0 pb-4">
                <Card.Text>{data.notes}</Card.Text>
              </Card.Body>
            </Card>

            <ChargeAttachments />

            <Card className="border-0 page-section mb-3">
              <Card.Header className="border-0 pt-3 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary">Audit Log</p>
              </Card.Header>
              <Card.Body className="text-start px-0 pt-0 pb-4">
                <Log logs={[]} />
              </Card.Body>
            </Card>
          </PageContainer>
        );
      }}
    />
  );
};

const ChargeAttachments = () => {
  const { charge: charge_id } = useParams();

  // create attachment
  const [
    createChargeAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: attachmentError },
  ] = useCreateChargeAttachmentsMutation();

  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: attachmentError,
  });

  const [
    deleteChargeAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeleteChargeAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as IChargeAttachments;
    if (attachment.id && attachment.charge) {
      await deleteChargeAttachments(attachment.id);
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (charge_id && Number(charge_id) > 0) {
      return await createChargeAttachments({ ...data, charge: Number(charge_id) });
    }
    return Promise.reject('Incomplete data found');
  };

  // get rental attachments
  const attachments = useGetChargeAttachmentsQuery(getValidID(charge_id));

  return (
    <div className="shadow page-section mb-3">
      <Attachments
        {...attachments}
        onDelete={handleAttachmentDelete}
        onUpload={handleAttachmentUpload}
        uploadPermission={PERMISSIONS.ACCOUNTS}
        deletePermission={PERMISSIONS.ACCOUNTS}
        uploadInfo={{ folder: 'attachments', module: 'charges' }}
      />
    </div>
  );
};

export default ChargeDetails;
