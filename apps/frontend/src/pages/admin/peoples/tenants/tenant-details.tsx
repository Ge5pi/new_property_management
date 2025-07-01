import { Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetLeaseByIdQuery } from 'services/api/lease';
import { useGetRentalApplicationsByIdQuery } from 'services/api/rental-applications';
import {
  useCreateTenantAttachmentsMutation,
  useDeleteTenantAttachmentsMutation,
  useGetTenantAttachmentsQuery,
  useGetTenantByIdQuery,
} from 'services/api/tenants';

import { Attachments } from 'components/attachments';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { InformationSkeleton } from 'components/skeleton';

import { RenderInformation } from 'core-ui/render-information';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

import { IAttachments } from 'interfaces/IAttachments';
import { ITenantAttachments } from 'interfaces/ITenant';

import TenantRentalLeaseSection from './components/tenant-rental-lease-section';

const TenantDetails = () => {
  const { tenant: tenant_id } = useParams();

  // get tenant by id
  const tenant = useGetTenantByIdQuery(getValidID(tenant_id));
  const tenant_attachments = useGetTenantAttachmentsQuery(getValidID(tenant_id));

  const lease = useGetLeaseByIdQuery(getIDFromObject('lease', tenant.data));
  const rental_application = useGetRentalApplicationsByIdQuery(getIDFromObject('rental_application_id', tenant.data));

  // create attachment
  const [
    createTenantAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: attachmentError },
  ] = useCreateTenantAttachmentsMutation();
  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: attachmentError,
  });

  const [
    deleteTenantAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeleteTenantAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as ITenantAttachments;
    if (attachment.id && attachment.tenant) {
      await deleteTenantAttachments({ tenant: attachment.tenant, id: attachment.id });
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (!isNaN(Number(tenant_id)) && Number(tenant_id) > 0) {
      return await createTenantAttachments({ ...data, tenant: Number(tenant_id) });
    }
    return Promise.reject('Incomplete data found');
  };

  return (
    <ApiResponseWrapper
      {...tenant}
      renderResults={data => {
        return (
          <PageContainer>
            <div className="component-margin-y">
              <div className="my-3">
                <Row className="align-items-end">
                  <Col>
                    <div>
                      <BackButton />
                      <h1 className="fw-bold h4 mt-1"> Tenant Details </h1>
                    </div>
                  </Col>
                </Row>
              </div>
              {/* General details */}
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Summary</p>
                  <p>This sections includes overall summary of this tenant information</p>
                </Card.Header>
                <Card.Body className="p-0">
                  <Row className="align-items-center">
                    <Col sm={5}>
                      <Row className="gx-3 gy-4">
                        <Col sm={6}>
                          <RenderInformation title="Tenant Name" description={`${data.first_name} ${data.last_name}`} />
                        </Col>
                      </Row>
                      <Row className="gx-3 gy-4">
                        <Col sm={6}>
                          <RenderInformation title="Property Name" description={data.property_name} />
                        </Col>
                        <Col sm={6}>
                          <RenderInformation title="Unit Name" description={data.unit_name} />
                        </Col>
                      </Row>
                      <ApiResponseWrapper
                        {...lease}
                        showMiniError
                        loadingComponent={
                          <InformationSkeleton skeletonType="column" title={false} columnCount={2} sm={6}>
                            <InformationSkeleton lines="single" />
                          </InformationSkeleton>
                        }
                        renderResults={lease_data => (
                          <Row className="gx-3 gy-3">
                            <Col sm={6}>
                              <RenderInformation title="Lease start date" date={lease_data.start_date} />
                            </Col>
                            <Col sm={6}>
                              <RenderInformation title="Lease end date" date={lease_data.end_date} />
                            </Col>
                          </Row>
                        )}
                      />

                      <Row className="gx-3 gy-3">
                        <Col sm={6}>
                          <RenderInformation title="Rent Paid this month ?" description={'-'} />
                        </Col>
                      </Row>
                    </Col>
                    <Col sm={2}>
                      <hr className="vertical-rule" />
                    </Col>
                    <Col sm={5}>
                      <Row className="gx-3 gy-4">
                        <Col sm={6}>
                          <ApiResponseWrapper
                            {...rental_application}
                            showError={false}
                            hideIfNoResults
                            loadingComponent={<InformationSkeleton lines="single" />}
                            renderResults={rental_application_data => (
                              <RenderInformation
                                title="Rental Application"
                                html={
                                  <Link
                                    to={`/admin/leasing/rental-applications/${rental_application_data.applicant}/details/${rental_application_data.id}`}
                                    className="text-uppercase btn-link link-info btn-sm"
                                  >
                                    {rental_application_data.slug}
                                  </Link>
                                }
                              />
                            )}
                          />
                        </Col>
                      </Row>
                      <Row className="gx-3 gy-4">
                        <Col sm={6}>
                          <RenderInformation title="Recurring Charges" desClass="price-symbol" description={'-'} />
                        </Col>
                        <Col sm={6}>
                          <RenderInformation title="Current Balance" desClass="price-symbol" description={'-'} />
                        </Col>
                      </Row>
                      <Row className="gx-3 gy-4">
                        <Col sm={6}>
                          <RenderInformation title="Dues Amount" desClass="price-symbol" description={'-'} />
                        </Col>
                      </Row>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* personal info */}
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Personal Information</p>
                  <p className="small">This sections includes all personal information about the tenant</p>
                </Card.Header>
                <Card.Body className="p-0">
                  <ApiResponseWrapper
                    {...rental_application}
                    showMiniError
                    loadingComponent={
                      <InformationSkeleton skeletonType="column" title={false} columnCount={3} xl={3} lg={4} md={6}>
                        <InformationSkeleton lines="single" />
                      </InformationSkeleton>
                    }
                    renderResults={rental_application_data => (
                      <Row className="gx-3 gy-4">
                        <Col xl={3} lg={4} md={6}>
                          <RenderInformation title="Date of Birth" date={rental_application_data.birthday} />
                        </Col>
                        <Col xl={3} lg={4} md={6}>
                          <RenderInformation title="SSN (or TIN)" description={rental_application_data.ssn_or_tin} />
                        </Col>
                        <Col xl={3} lg={4} md={6}>
                          <RenderInformation
                            title="Driving License Number"
                            description={rental_application_data.driving_license_number}
                          />
                        </Col>
                      </Row>
                    )}
                  />
                </Card.Body>
              </Card>

              {data.lease && data.rental_application_id && (
                <TenantRentalLeaseSection
                  lease_id={Number(data.lease)}
                  rental_id={Number(data.rental_application_id)}
                  tenant={Number(tenant_id)}
                />
              )}

              <div className="my-4 page-section">
                <Attachments
                  {...tenant_attachments}
                  uploadPermission={PERMISSIONS.PEOPLE}
                  deletePermission={PERMISSIONS.PEOPLE}
                  onDelete={handleAttachmentDelete}
                  onUpload={handleAttachmentUpload}
                  uploadInfo={{ module: 'tenants', folder: 'attachments' }}
                />
              </div>
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default TenantDetails;
