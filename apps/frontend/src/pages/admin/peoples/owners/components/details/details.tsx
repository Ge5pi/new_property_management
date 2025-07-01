import { lazy, useState } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateOwnerUpcomingActivityMutation,
  useDeleteOwnerMutation,
  useGetOwnerUpcomingActivitiesQuery,
  useGetOwnersByIdQuery,
} from 'services/api/owners';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getCountry, getValidID } from 'utils/functions';

import { IOwnerUpcomingActivities } from 'interfaces/IPeoples';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

import OwnerPortal from './owner-portal';
import OwnerWithdrawal from './owner-withdrawal';
import PropertiesOwned from './properties-owned';

const UpcomingActivities = lazy(() => import('components/upcoming-activities/upcoming-activities'));

const OwnerDetails = () => {
  const { redirect } = useRedirect();

  const { owner: owner_id } = useParams();

  const owner = useGetOwnersByIdQuery(getValidID(owner_id));

  const [deleteOwnerByID, { isSuccess: isDeleteOwnerSuccess, isError: isDeleteOwnerError, error: deleteOwnerError }] =
    useDeleteOwnerMutation();

  useResponse({
    isSuccess: isDeleteOwnerSuccess,
    successTitle: 'Owner has been deleted',
    isError: isDeleteOwnerError,
    error: deleteOwnerError,
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
        deleteOwnerByID(id)
          .then(result => {
            if (result.data) {
              redirect(`/owners`, true, 'owners');
            }
          })
          .finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
      }
    });
  };

  const upcoming_activities = useGetOwnerUpcomingActivitiesQuery(getValidID(owner_id));

  const [
    createUpcomingActivity,
    {
      isSuccess: isCreateUpcomingActivitySuccess,
      isError: isCreateUpcomingActivityError,
      error: createUpcomingActivityError,
    },
  ] = useCreateOwnerUpcomingActivityMutation();

  useResponse({
    isSuccess: isCreateUpcomingActivitySuccess,
    successTitle: 'New Upcoming Activity has been added',
    isError: isCreateUpcomingActivityError,
    error: createUpcomingActivityError,
  });
  const handleUpcomingActivity = async (values: IUpcomingActivities) => {
    if (!isNaN(Number(owner_id)) && Number(owner_id) > 0) {
      return await createUpcomingActivity({ ...values, owner: Number(owner_id) } as IOwnerUpcomingActivities);
    }

    return Promise.reject('Incomplete data found');
  };

  return (
    <ApiResponseWrapper
      {...owner}
      renderResults={data => {
        return (
          <div className="component-margin-y">
            {/* General details */}

            <PageContainer>
              <div className="my-3">
                <Row className="align-items-end">
                  <Col>
                    <div>
                      <BackButton />
                      <h1 className="fw-bold h4 mt-1"> Owner details </h1>
                    </div>
                  </Col>
                  <Col sm={'auto'}>
                    <div className="my-3">
                      <Stack gap={3} className="justify-content-end" direction="horizontal">
                        <DeleteBtn
                          showText
                          permission={PERMISSIONS.PEOPLE}
                          disabled={disabled}
                          onClick={() => data.id && deleteRecord(data.id)}
                        />
                        <EditBtn
                          permission={PERMISSIONS.PEOPLE}
                          onClick={() => {
                            redirect(`/owners/${data.id}/modify`, false, 'owners');
                          }}
                        />
                      </Stack>
                    </div>
                  </Col>
                </Row>
              </div>
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">General Details</p>
                </Card.Header>
                <Card.Body className="p-0">
                  <Row className="gx-3 gy-4">
                    <Col sm={3}>
                      <RenderInformation title="First Name" description={data.first_name} />
                    </Col>
                    <Col sm={3}>
                      <RenderInformation title="Last Name" description={data.last_name} />
                    </Col>
                  </Row>
                  <Row className="gx-3 gy-3">
                    <Col sm={3}>
                      <RenderInformation title="Company Name" description={data.company_name} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Property owned and upcoming activities table */}
              <Row className="gx-3 gy-4 align-items-stretch">
                <Col lg={5}>
                  <PropertiesOwned />
                </Col>
                <Col lg={7}>
                  <UpcomingActivities
                    {...upcoming_activities}
                    permission={PERMISSIONS.PEOPLE}
                    createUpcomingActivity={handleUpcomingActivity}
                  />
                </Col>
              </Row>

              {/* Contact details */}
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Contact Details</p>
                </Card.Header>
                <Card.Body className="p-0">
                  <Row className="gx-3 gy-4">
                    {data.personal_contact_numbers && data.personal_contact_numbers.length > 0 ? (
                      <Col sm={3}>
                        <RenderInformation title="Personal Number" phone={data.personal_contact_numbers} />
                      </Col>
                    ) : (
                      <Col sm={3}>
                        <RenderInformation title="Personal Number" description={'N/A'} />
                      </Col>
                    )}
                    {data.personal_emails && data.personal_emails.length > 0 ? (
                      <Col sm={3}>
                        <RenderInformation title="Personal Email" email={data.personal_emails} />
                      </Col>
                    ) : (
                      <Col sm={3}>
                        <RenderInformation title="Personal Email" description={'N/A'} />
                      </Col>
                    )}
                  </Row>
                  <Row className="gx-3 gy-4">
                    {data.company_contact_numbers && data.company_contact_numbers.length > 0 ? (
                      <Col sm={3}>
                        <RenderInformation title="Company Phone Number" phone={data.company_contact_numbers} />
                      </Col>
                    ) : (
                      <Col sm={3}>
                        <RenderInformation title="Company Phone Number" description={'N/A'} />
                      </Col>
                    )}
                    {data.company_emails && data.company_emails.length > 0 ? (
                      <Col sm={3}>
                        <RenderInformation title="Company Email" email={data.company_emails} />
                      </Col>
                    ) : (
                      <Col sm={3}>
                        <RenderInformation title="Company Email" description={'N/A'} />
                      </Col>
                    )}
                  </Row>

                  <RenderInformation title="Street address" description={data.street_address} />
                  <Row className="gx-3 gy-4">
                    <Col sm={3} md={2}>
                      <RenderInformation title="Country" description={getCountry(data.country)} />
                    </Col>
                    <Col sm={3} md={2}>
                      <RenderInformation title="City" description={data.city} />
                    </Col>
                    <Col sm={3} md={2}>
                      <RenderInformation title="State" description={data.state} />
                    </Col>
                    <Col sm={3} md={2}>
                      <RenderInformation title="ZIP code" description={data.zip} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Owner portal */}
              <OwnerPortal />

              {/* Tax payer info */}
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Tax Payer Information</p>
                </Card.Header>
                <Card.Body className="p-0">
                  <Row className="gx-3 gy-4">
                    <Col sm={3}>
                      <RenderInformation title="Tax payer name" description={data.tax_payer} />
                    </Col>
                    <Col sm={3}>
                      <RenderInformation title="Tax payer ID" description={data.tax_payer_id} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Bank account details */}
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Bank Account Details</p>
                </Card.Header>
                <Card.Body className="p-0">
                  <Row className="gx-3 gy-4">
                    <Col sm={3}>
                      <RenderInformation title="Bank Name" description={data.bank_name} />
                    </Col>
                    <Col sm={3}>
                      <RenderInformation title="Bank branch" description={data.bank_branch} />
                    </Col>
                  </Row>
                  <Row className="gx-3 gy-4">
                    <Col sm={3}>
                      <RenderInformation title="Routing No." description={data.bank_routing_number} />
                    </Col>
                    <Col sm={3}>
                      <RenderInformation title="Bank Account Title" description={data.bank_account_title} />
                    </Col>
                    <Col sm={3}>
                      <RenderInformation title="Bank Account Number" description={data.bank_account_number} />
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* owner withdrawal */}
              <OwnerWithdrawal />
            </PageContainer>
          </div>
        );
      }}
    />
  );
};

export default OwnerDetails;
