import { useState } from 'react';
import { Badge, Button, Col, Container, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useDeleteUserMutation,
  useGetListOfRolesQuery,
  useGetUserByIdQuery,
  useUpdateUserMutation,
} from 'services/api/users';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { ChangePasswordModal } from 'core-ui/popups/change-password';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useAuthState } from 'hooks/useAuthState';
import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getUserAccountType, getValidID } from 'utils/functions';

const UserDetails = () => {
  const { user: user_id } = useParams();
  const { redirect } = useRedirect();
  const { userID, user: currentUser } = useAuthState();

  const user = useGetUserByIdQuery(getValidID(user_id));
  const role = useGetListOfRolesQuery(
    user.data && user.data.roles && user.data.roles.length > 0 ? user.data.roles : skipToken
  );

  const [deleteUserByID, { isSuccess: isDeleteUserSuccess, isError: isDeleteUserError, error: deleteUserError }] =
    useDeleteUserMutation();

  useResponse({
    isSuccess: isDeleteUserSuccess,
    successTitle: 'You have deleted a user',
    isError: isDeleteUserError,
    error: deleteUserError,
  });

  const [suspendAccount, { isSuccess: isUpdateUserSuccess, isError: isUpdateUserError, error: updateUserError }] =
    useUpdateUserMutation();

  useResponse({
    isSuccess: isUpdateUserSuccess,
    successTitle: 'User account status has been updated',
    isError: isUpdateUserError,
    error: updateUserError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = () => {
    if (user_id && Number(user_id) > 0) {
      Confirmation({
        type: 'danger',
        description: `Are you sure you want to delete this user?\nThis may result in unexpected behavior such as, removal of data associated with this user. Considered suspending their account instead.`,
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          setDisabled(true);
          deleteUserByID(user_id)
            .then(result => {
              if (result.data) {
                redirect(`/users-and-roles`, true, 'users-and-roles');
              }
            })
            .finally(() => {
              SwalExtended.close();
              setDisabled(false);
            });
        }
      });
    }
  };

  const handleSuspendAccount = (is_active?: boolean) => {
    if (user_id && Number(user_id) > 0 && typeof is_active === 'boolean') {
      Confirmation({
        type: 'warning',
        description: `${
          is_active
            ? 'You are about to suspense this account. Are you sure?'
            : 'Are you sure you want to activate this account?'
        }`,
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          setDisabled(true);
          suspendAccount({ id: user_id, is_active: !is_active }).finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
        }
      });
    }
  };

  return (
    <div className="my-4">
      <PageContainer>
        <Row className="align-items-end mb-3">
          <Col>
            <BackButton />
            <h1 className="fw-bold h4 mt-1">User Details</h1>
          </Col>
          <Col xs="auto">
            {Number(userID) !== Number(user_id) && (
              <DeleteBtn
                permission={PERMISSIONS.ADMIN}
                showText
                className="me-3"
                disabled={disabled}
                onClick={deleteRecord}
              />
            )}
            <EditBtn
              permission={PERMISSIONS.ADMIN}
              onClick={() => redirect(`/users-and-roles/modify/${user_id}`, false, 'users-and-roles')}
            />
          </Col>
        </Row>
        <ApiResponseWrapper
          {...user}
          renderResults={data => (
            <Container fluid className="bg-white py-3">
              <Row className="g-3 align-items-center justify-content-between mb-3">
                <Col>
                  <p className="fw-bold m-0 text-primary">Personal Information</p>
                </Col>
                {currentUser && getUserAccountType(currentUser) === 'SUPER_ADMIN' && (
                  <Col sm="auto">
                    {typeof data.is_active === 'boolean' && Number(userID) !== Number(user_id) && (
                      <Button
                        className="me-3"
                        onClick={() => handleSuspendAccount(data.is_active)}
                        variant="outline-primary"
                      >
                        {data.is_active ? 'Suspend Account' : 'Activate Account'}
                      </Button>
                    )}
                    <Button
                      variant="outline-primary"
                      onClick={() => {
                        SweetAlert({
                          size: 'md',
                          html: <ChangePasswordModal />,
                        }).fire({
                          allowOutsideClick: () => !SwalExtended.isLoading(),
                        });
                      }}
                    >
                      Change Password
                    </Button>
                  </Col>
                )}
              </Row>
              <Row className="gy-3 my-3">
                <Col xxl={4} sm={6}>
                  <RenderInformation title="First Name" description={data.first_name} />
                </Col>
                <Col xxl={4} sm={6}>
                  <RenderInformation title="Last Name" description={data.last_name} />
                </Col>
              </Row>

              <Row className="gy-3 mb-3">
                <Col xs={12}>
                  <div className="pt-4 mb-2">
                    <p className="fw-bold m-0 text-primary">Contact Details</p>
                  </div>
                </Col>
                <Col xxl={4} sm={6}>
                  <RenderInformation title="Telephone Number" phone={data.telephone_number} />
                </Col>
                <Col xxl={4} sm={6}>
                  <RenderInformation title="Mobile Number" phone={data.mobile_number} />
                </Col>
              </Row>
              <Row className="gy-3 mb-3">
                <Col xxl={4} sm={6}>
                  <RenderInformation title="Primary Email" email={data.email} />
                </Col>
                <Col xxl={4} sm={6}>
                  <RenderInformation title="Secondary Email" email={data.secondary_email} />
                </Col>
              </Row>
              <Row className="gy-3 mb-3">
                <Col xxl={4} sm={6}>
                  <RenderInformation title="Other Info" description={data.other_information} />
                </Col>
              </Row>

              <ApiResponseWrapper
                {...role}
                hideIfNoResults
                showError={false}
                loadingComponent={
                  <InformationSkeleton skeletonType="column" columnCount={4} xs={'auto'}>
                    <InlineSkeleton bg="placeholder" className="px-5 py-2 d-inline-block" as={Badge} pill />
                  </InformationSkeleton>
                }
                renderResults={data => (
                  <RenderInformation
                    title="Roles"
                    html={
                      <Stack direction="horizontal" className="mt-2 h6" gap={1}>
                        {data
                          .filter(d => d.id)
                          .map(item => (
                            <Badge
                              pill
                              key={item.id}
                              bg="transparent"
                              className="border border-primary border-opacity-50 text-muted border-1 px-3"
                            >
                              {item.name}
                            </Badge>
                          ))}
                      </Stack>
                    }
                  />
                )}
              />
            </Container>
          )}
        />
      </PageContainer>
    </div>
  );
};

export default UserDetails;
