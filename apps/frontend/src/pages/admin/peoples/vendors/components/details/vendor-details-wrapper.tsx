import { useState } from 'react';
import { ButtonGroup, Col, Row, Stack } from 'react-bootstrap';
import { NavLink, useParams } from 'react-router-dom';

import useResponse from 'services/api/hooks/useResponse';
import { useDeleteVendorMutation } from 'services/api/vendors';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import OutletSuspense from 'components/layouts/layout-container/outlet-suspense';
import PageContainer from 'components/page-container';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';

const VendorDetailsWrapper = () => {
  const [width] = useWindowSize();

  const { redirect, modifyCurrentPath } = useRedirect();

  const { vendor: vendor_id } = useParams();

  const [
    deleteVendorByID,
    { isSuccess: isDeleteVendorSuccess, isError: isDeleteVendorError, error: deleteVendorError },
  ] = useDeleteVendorMutation();

  useResponse({
    isSuccess: isDeleteVendorSuccess,
    successTitle: 'Vendor has been deleted',
    isError: isDeleteVendorError,
    error: deleteVendorError,
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
        deleteVendorByID(id)
          .then(result => {
            if (result.data) {
              redirect(`/vendors`, true, 'vendors');
            }
          })
          .finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
      }
    });
  };

  const path = modifyCurrentPath(`/vendors/${vendor_id}`, `vendors/${vendor_id}`);
  return (
    <div className="component-margin-y">
      <PageContainer>
        <BackButton />
        <h1 className="fw-bold h4 mt-1 mb-4">Vendor details</h1>

        <Row className="gx-2 gy-4">
          <Col>
            <ButtonGroup className="flex-wrap" size={width <= 576 ? 'sm' : undefined}>
              <NavLink
                id={`radio-general-details`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/general-details`}
                replace={true}
                end
              >
                General
              </NavLink>
              <NavLink
                id={`radio-finances-details`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/finances-details`}
                end
              >
                Finances
              </NavLink>
              <NavLink
                id={`radio-communication-details`}
                className={'btn btn-primary fw-bold primary-tab px-4'}
                to={`${path}/messages`}
                end
              >
                Communication
              </NavLink>
            </ButtonGroup>
          </Col>
          <Col sm={'auto'} xs={12}>
            <div>
              <Stack gap={3} className="justify-content-end" direction="horizontal">
                <DeleteBtn
                  showText
                  disabled={disabled}
                  permission={PERMISSIONS.PEOPLE}
                  onClick={() => vendor_id && deleteRecord(vendor_id)}
                />
                <EditBtn
                  permission={PERMISSIONS.PEOPLE}
                  onClick={() => {
                    redirect(`/vendors/${vendor_id}/modify`, false, 'vendors');
                  }}
                />
              </Stack>
            </div>
          </Col>
        </Row>
      </PageContainer>
      <OutletSuspense />
    </div>
  );
};

export default VendorDetailsWrapper;
