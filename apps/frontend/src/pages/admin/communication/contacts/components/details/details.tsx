import { useState } from 'react';
import { Card, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useDeleteContactMutation, useGetContactByIdQuery } from 'services/api/contacts';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const Details = () => {
  const { contact: contact_id } = useParams();
  const contact = useGetContactByIdQuery(getValidID(contact_id));

  const [
    deleteContactsByID,
    { isSuccess: isDeleteContactsSuccess, isError: isDeleteContactsError, error: deleteContactsError },
  ] = useDeleteContactMutation();

  useResponse({
    isSuccess: isDeleteContactsSuccess,
    successTitle: 'You have deleted a Contact',
    isError: isDeleteContactsError,
    error: deleteContactsError,
  });

  const { redirect } = useRedirect();
  const [disabled, setDisabled] = useState(false);
  const deleteRecord = () => {
    if (contact_id) {
      Confirmation({
        type: 'danger',
        description: 'Are you sure you want to delete this record?',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          setDisabled(true);
          deleteContactsByID(contact_id).finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
        }
      });
    }
  };

  return (
    <ApiResponseWrapper
      {...contact}
      renderResults={data => {
        return (
          <PageContainer>
            <div>
              <Stack direction="horizontal" className="justify-content-between">
                <div>
                  <BackButton />
                  <h1 className="fw-bold h4 mt-1 mb-3">View contact</h1>
                </div>

                <div>
                  <DeleteBtn
                    onClick={deleteRecord}
                    disabled={disabled}
                    permission={PERMISSIONS.COMMUNICATION}
                    showText
                    className="me-3"
                  />
                  <EditBtn
                    onClick={() => redirect(`/modify/${contact_id}`, false, 'details')}
                    permission={PERMISSIONS.COMMUNICATION}
                  />
                </div>
              </Stack>
            </div>

            <Card className="border-0 p-0 page-section mb-3">
              <Card.Body className="p-4">
                <RenderInformation title={data.name} description={data.category_name} titleClass="fw-bold" />

                <Stack direction="horizontal" gap={5}>
                  <RenderInformation title="Primary contact" phone={data.primary_contact} desClass="m-0" />
                  <RenderInformation title="Secondary contact" phone={data.secondary_contact} desClass="m-0" />
                </Stack>

                <RenderInformation title="Email address" email={data.email} />
                <RenderInformation title="Website address" link={data.website} />
                <RenderInformation title="Street address" description={data.street_address} />

                <Stack direction="horizontal" gap={5}>
                  <div className="form-check">
                    <span className={clsx({ 'checked-mark': data.display_to_tenants }, 'form-check-input')}></span>
                    <span className="form-check-label">Display to tenants</span>
                  </div>
                  <div className="form-check">
                    <span className={clsx({ 'checked-mark': data.selective }, 'form-check-input')}></span>
                    <span className="form-check-label">Selective</span>
                  </div>
                </Stack>
              </Card.Body>
            </Card>
          </PageContainer>
        );
      }}
    />
  );
};

export default Details;
