import { Fragment, useEffect, useState } from 'react';
import { Button, Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import {
  useDeleteRentalApplicantMutation,
  useGetRentalApplicantByIdQuery,
  useUpdateRentalApplicantMutation,
} from 'services/api/applicants';
import useResponse from 'services/api/hooks/useResponse';
import {
  useGetRentalApplicationsByIdQuery,
  useUpdateRentalApplicationsMutation,
} from 'services/api/rental-applications';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import Skeleton from 'components/skeleton';

import { CustomSelect } from 'core-ui/custom-select';
import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { NewTabIcon } from 'core-ui/icons';
import NewApplicantsModal from 'core-ui/popups/new-applicants/new-applicants-modal';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { rentalApplicationSteps } from 'constants/steps';
import { getReadableError, getValidID, isEmpty, isPositiveNumber } from 'utils/functions';

import { ISingleRentalForm, RentalStatusType } from 'interfaces/IApplications';

import RentalApplicationForm from './components/rental-application-steps';

import '../leasing.styles.css';

const RentalApplicationDetails = () => {
  const { applicant: applicant_id, application: application_id } = useParams();
  const { refetch, ...applicant } = useGetRentalApplicantByIdQuery(getValidID(applicant_id));

  const { redirect } = useRedirect();

  // update Applicant
  const [
    updateApplicant,
    { isSuccess: isUpdateApplicantsSuccess, isError: isUpdateApplicantsError, error: updateApplicantError },
  ] = useUpdateRentalApplicantMutation();

  useResponse({
    isSuccess: isUpdateApplicantsSuccess,
    successTitle: 'Applicant detail has been successfully updated!',
    isError: isUpdateApplicantsError,
    error: updateApplicantError,
  });

  const {
    data: rental_application,
    isLoading,
    isFetching,
    isError,
    error,
  } = useGetRentalApplicationsByIdQuery(getValidID(application_id));

  const [currentApplicationStatus, setCurrentApplicationStatus] = useState<RentalStatusType>('DRAFT');

  useEffect(() => {
    if (rental_application && rental_application.status) {
      setCurrentApplicationStatus(rental_application.status as RentalStatusType);
    }
  }, [rental_application]);

  const [
    updateRentalStatus,
    { isError: isUpdateRentalStatusError, error: updateRentalStatusError, isSuccess: isUpdateRentalStatusSuccess },
  ] = useUpdateRentalApplicationsMutation();

  useResponse({
    isSuccess: isUpdateRentalStatusSuccess,
    successTitle: 'Application Status has been updated!',
    isError: isUpdateRentalStatusError,
    error: updateRentalStatusError,
  });

  const [
    deleteRentalApplicantByID,
    {
      isSuccess: isDeleteRentalApplicantSuccess,
      isError: isDeleteRentalApplicantError,
      error: deleteRentalApplicantError,
    },
  ] = useDeleteRentalApplicantMutation();

  useResponse({
    isSuccess: isDeleteRentalApplicantSuccess,
    successTitle: 'You have deleted Applicant',
    isError: isDeleteRentalApplicantError,
    error: deleteRentalApplicantError,
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
        deleteRentalApplicantByID(id)
          .then(result => {
            if (result.data) {
              redirect('/rental-applications', true, 'rental-applications');
            }
          })
          .finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
      }
    });
  };

  const handleSelectionChange = (value: string) => {
    const applicant_details = applicant.data;
    if (applicant_details && !isEmpty(applicant_details)) {
      if (
        applicant_details.id &&
        applicant_details.property_id &&
        applicant_details.unit &&
        applicant_details.rental_application
      ) {
        const id = Number(applicant_details.id);
        const property_id = Number(applicant_details.property_id);
        const application_id = Number(applicant_details.rental_application);
        const unit_id = Number(applicant_details.unit);

        const status = value as RentalStatusType;
        const prev = currentApplicationStatus;
        setCurrentApplicationStatus(status);
        updateRentalStatus({
          status,
          id: Number(application_id),
          applicant: Number(id),
        }).then(result => {
          if ('error' in result) {
            setCurrentApplicationStatus(prev);
          } else {
            if (status === 'APPROVED') {
              redirect(
                `/leasing/leases/create?applicant_id=${id}&unit_id=${unit_id}&property_id=${property_id}`,
                false,
                'leasing'
              );
              return;
            }
          }
        });
      }
    }
  };

  const redirectToLease = (lease_id?: number) => {
    if (lease_id && lease_id > 0) {
      redirect(`/leasing/leases/details/${lease_id}`, false, 'leasing');
      return;
    }
  };

  return (
    <ApiResponseWrapper
      {...applicant}
      renderResults={data => {
        let steps: Array<{ label: string; name: string }> = [];
        if (rental_application) {
          steps = Object.keys(rental_application)
            .filter(r => typeof rental_application[r as keyof ISingleRentalForm] === 'boolean')
            .flatMap(stepName => {
              return rentalApplicationSteps.filter(
                r => r.name === stepName && Boolean(rental_application[stepName as keyof ISingleRentalForm])
              );
            });
        }

        return (
          <PageContainer>
            <div className="my-3">
              <Row className="align-items-end">
                <Col>
                  <div>
                    <BackButton />
                    <h1 className="fw-bold h4 mt-1"> Rental Application Form </h1>
                  </div>
                </Col>
                <Col sm={'auto'}>
                  <div className="my-3">
                    <Stack gap={3} className="justify-content-end" direction="horizontal">
                      <DeleteBtn
                        showText
                        permission={PERMISSIONS.LEASING}
                        disabled={disabled}
                        onClick={() => data.id && deleteRecord(data.id)}
                      />
                      <EditBtn
                        permission={PERMISSIONS.LEASING}
                        onClick={() => {
                          SweetAlert({
                            size: 'lg',
                            html: <NewApplicantsModal applicant={data} updateApplicant={updateApplicant} update />,
                          }).fire({
                            allowOutsideClick: () => !SwalExtended.isLoading(),
                          });
                        }}
                      />
                    </Stack>
                  </div>
                </Col>
              </Row>

              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 bg-transparent text-start">
                  <Row className="align-items-center justify-content-between">
                    <Col className="order-sm-0 order-1">
                      <p className="fw-bold m-0 text-primary">Applicant form</p>
                      <p className="small">View the applicant information</p>
                    </Col>
                    {!isError && (
                      <Col sm={'auto'}>
                        <div className="select-status-wrapper mb-sm-0 mb-4 ms-auto">
                          {!data.property_rental_application_template ? (
                            <div className="btn btn-light w-100 text-start disabled">Draft</div>
                          ) : (
                            <div className="text-end">
                              {isLoading || isFetching ? (
                                <Skeleton xs={12} />
                              ) : rental_application && isPositiveNumber(rental_application.lease_id) ? (
                                <Button
                                  variant="link"
                                  onClick={() => redirectToLease(rental_application.lease_id)}
                                  className="link-info text-uppercase"
                                >
                                  view lease
                                </Button>
                              ) : (
                                <CustomSelect
                                  name="rental_application_status"
                                  onSelectChange={handleSelectionChange}
                                  classNames={{ backgroundClass: `status-${currentApplicationStatus.toLowerCase()}` }}
                                  disabled={!data.property_rental_application_template}
                                  controlId="ApplicationFormStatus"
                                  value={currentApplicationStatus}
                                  options={[
                                    { label: 'Draft', value: 'DRAFT' },
                                    { label: 'Pending', value: 'PENDING' },
                                    { label: 'Approved', value: 'APPROVED' },
                                    { label: 'Rejected', value: 'REJECTED' },
                                    { label: 'On Hold/Waiting', value: 'ON_HOLD_OR_WAITING' },
                                  ]}
                                />
                              )}
                            </div>
                          )}
                        </div>
                      </Col>
                    )}
                  </Row>
                </Card.Header>

                <Card.Body className="px-0 text-start">
                  <Row className="gx-sm-4 gx-0 justify-content-between">
                    <Col sm={8} md={5} xxl={4}>
                      <RenderInformation title="Legal Full Name" description={`${data.first_name} ${data.last_name}`} />
                    </Col>
                  </Row>

                  <Row className="gx-sm-4 gx-0">
                    <Col sm={8} md={5} xxl={4}>
                      <RenderInformation title="Email address" email={data.email} />
                    </Col>
                    <Col sm={8} md={5} xxl={4}>
                      <RenderInformation title="Phone number" phone={data.phone_number} />
                    </Col>
                  </Row>

                  <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                    <Col md={6}>
                      <div className="mb-4">
                        <div className="form-check">
                          <span
                            className={clsx('form-check-input', {
                              'checked-mark checked-mark-green': data.allow_email_for_rental_application,
                            })}
                          ></span>
                          <span className="form-check-label">
                            Email applicant for the rental application <br />
                            {data.allow_email_for_rental_application ?? ''}
                          </span>
                        </div>
                      </div>
                    </Col>
                  </Row>
                  <Row className="align-items-center gx-sm-4 gx-0">
                    <Col sm={8} md={5} xxl={4}>
                      <RenderInformation title="Property Name" description={data.property_name} />
                    </Col>
                    <Col sm={8} md={5} xxl={4}>
                      <RenderInformation title="Unit Name" description={data.unit_name} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
              {!data.property_rental_application_template ? (
                <Card className="border-0 p-4 page-section">
                  <Card.Subtitle className="text-muted text-center mb-2">
                    No rental template found for this property
                  </Card.Subtitle>
                  <Card.Header className="p-0 border-0 bg-transparent text-center">
                    <Card.Text>
                      Please Select A Template For:
                      <span className="fw-bold mx-1">{data.property_name}</span>
                    </Card.Text>
                    <Button
                      className="btn btn-link link-info d-inline-flex align-items-center"
                      onClick={() => {
                        const popup = window.open(
                          `/admin/properties/${data.property_id}/details?popup=true#:~:text=unknown-,Lease,-settings`,
                          '_blank'
                        );
                        if (popup) {
                          const timer = setInterval(() => {
                            if (popup && popup.closed) {
                              clearInterval(timer);
                              refetch();
                            }
                          }, 500);
                        }
                      }}
                    >
                      Open Property
                      <span className="mx-1">
                        <NewTabIcon />
                      </span>
                    </Button>
                  </Card.Header>
                </Card>
              ) : (
                <Fragment>
                  {isLoading ? (
                    <div className="text-dark text-opacity-50 text-center fs-6">Please wait...</div>
                  ) : isError && error ? (
                    <div className="text-danger text-center fs-6">{getReadableError(error, true)}</div>
                  ) : (
                    <RentalApplicationForm
                      rental_template_id={data.property_rental_application_template}
                      rental_application={rental_application}
                      applicationSteps={steps}
                      applicant={data}
                    />
                  )}
                </Fragment>
              )}
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default RentalApplicationDetails;
