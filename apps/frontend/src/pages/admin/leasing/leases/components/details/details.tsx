import { useRef } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { Link, useParams } from 'react-router-dom';
import { useReactToPrint } from 'react-to-print';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetChargesQuery } from 'services/api/charges';
import { useGetLeaseByIdQuery, useGetLeasesTenantsQuery } from 'services/api/lease';
import { useGetRentalApplicationsByIdQuery } from 'services/api/rental-applications';

import { BackButton } from 'components/back-button';
import { ItemDate, ItemPrice } from 'components/custom-cell';
import PageContainer from 'components/page-container';
import { InformationSkeleton } from 'components/skeleton';
import { TableWithPagination } from 'components/table';

import { EditBtn } from 'core-ui/edit-button';
import { DownloadIcon } from 'core-ui/icons';
import { LeaseAgreement, PreviewLeaseTemplate } from 'core-ui/popups/preview-lease-template';
import { RenderInformation } from 'core-ui/render-information';
import { SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

import './leases.styles.css';

const Details = () => {
  const { lease: lease_id } = useParams();
  const lease = useGetLeaseByIdQuery(getValidID(lease_id));
  const rental_application = useGetRentalApplicationsByIdQuery(getIDFromObject('rental_application', lease.data));
  const secondary_tenants = useGetLeasesTenantsQuery(getValidID(lease_id));

  const { redirect } = useRedirect();

  const printDiv = useRef<HTMLDivElement | null>(null);
  const handlePrint = useReactToPrint({
    content: () => printDiv.current,
  });

  return (
    <ApiResponseWrapper
      {...lease}
      renderResults={data => {
        const unit_name = data.unit_name;
        const property_name = data.property_name;
        const applicant_name = `${data.tenant_first_name} ${data.tenant_last_name}`;

        const property_id = getValidID(Number(data.property_id), false) as number;
        const unit_id = getValidID(Number(data.unit), false) as number;

        return (
          <div ref={printDiv} className="print-wrapper">
            <h1 className="position-relative container fs-6 fw-bold text-center my-5 print-visible">
              <hr className="m-0" />
              <span className="position-absolute top-50 left-50 translate-middle bg-light px-3">Lease Detail</span>
            </h1>
            <PageContainer className="print-body">
              <div className="my-3 print-hidden">
                <Row className="align-items-end justify-content-between">
                  <Col xs={'auto'}>
                    <div className="my-3">
                      <BackButton />
                    </div>
                  </Col>
                  <Col xs={'auto'}>
                    <div className="my-3">
                      <EditBtn
                        permission={PERMISSIONS.LEASING}
                        onClick={() => {
                          redirect(`/leases/${lease_id}/modify`, false, 'leases');
                        }}
                      />
                    </div>
                  </Col>
                </Row>
              </div>
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-3 bg-transparent text-start print-hidden">
                  <Row>
                    <Col>
                      <p className="fw-bold m-0 text-primary">Lease details</p>
                      <p className="small">Provide information regarding the applicant</p>
                    </Col>
                    <Col xs="auto">
                      <Button
                        size="sm"
                        variant="primary"
                        className="rounded-circle d-inline-flex align-items-center justify-content-center"
                        style={{ width: 32, height: 32 }}
                        onClick={() => {
                          const timer = setTimeout(() => {
                            handlePrint();
                            clearTimeout(timer);
                          }, 1000);
                        }}
                      >
                        <DownloadIcon size="18" />
                      </Button>
                    </Col>
                  </Row>
                </Card.Header>

                <Row className="gx-0">
                  <Col>
                    <RenderInformation title="Property Name" description={property_name} />
                  </Col>
                </Row>

                <Row className="gx-0">
                  <Col md={3}>
                    <RenderInformation title="Unit Name" description={unit_name} />
                  </Col>
                  <Col md={3}>
                    <RenderInformation title="Lease type" description={data.get_lease_type_display} />
                  </Col>
                  <Col md={4} sm={6}>
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
                <Row className="gx-0">
                  <Col md={3}>
                    <RenderInformation title="Start Date" date={data.start_date} />
                  </Col>
                  <Col md={3}>
                    <RenderInformation title="End Date" date={data.end_date} />
                  </Col>
                </Row>
                <Row className="gx-0 print-hidden">
                  <Col sm={6}>
                    <RenderInformation
                      title="Lease Template"
                      html={
                        <Button
                          size="sm"
                          variant="link"
                          className="px-0 link-info"
                          onClick={() => {
                            SweetAlert({
                              size: 'xl',
                              html: (
                                <PreviewLeaseTemplate
                                  lease={data}
                                  type="preview"
                                  property={property_id}
                                  applicant_name={applicant_name}
                                  unit_name={unit_name}
                                />
                              ),
                            }).fire();
                          }}
                        >
                          LT-00{data.lease_template}
                        </Button>
                      }
                    />
                  </Col>
                </Row>

                <div className="mb-3">
                  <ApiResponseWrapper
                    {...secondary_tenants}
                    hideIfNoResults
                    renderResults={tenants => (
                      <div>
                        <div className="mb-3">
                          <p className="fw-bold m-0 text-primary">Tenants</p>
                          <p className="small mb-0">Information regarding the tenants</p>
                        </div>
                        {tenants.map(tenant => {
                          return (
                            <Card key={tenant.id} className="py-4 px-3 mb-4 position-relative bg-secondary">
                              <Card.Body>
                                <Row className="g-sm-4">
                                  <Col sm>
                                    <RenderInformation
                                      title="Tenant Name"
                                      description={`${tenant.first_name} ${tenant.last_name}`}
                                    />
                                  </Col>
                                  <Col sm>
                                    <RenderInformation title="Tax Payer ID" description={`${tenant.tax_payer_id}`} />
                                  </Col>
                                </Row>
                                <Row className="g-sm-4">
                                  <Col sm>
                                    <RenderInformation title="Mobile Number" phone={tenant.phone_number} />
                                  </Col>
                                  <Col sm>
                                    <RenderInformation title="Email" email={tenant.email} />
                                  </Col>
                                </Row>
                                <RenderInformation title="Date of Birth" date={tenant.birthday} />
                                <RenderInformation title="Description" description={tenant.description} />
                              </Card.Body>
                            </Card>
                          );
                        })}
                      </div>
                    )}
                  />
                </div>

                <div className="mb-3">
                  <p className="fw-bold m-0 text-primary">Rent Details</p>
                  <p className="small">Provide information regarding the rent</p>
                </div>

                <Row className="gx-0">
                  <Col>
                    <RenderInformation title="Rent cycle" description={data.get_rent_cycle_display} />
                  </Col>
                </Row>
                <Row className="gx-0">
                  <Col md={3}>
                    <RenderInformation title="Amount" desClass="price-symbol" description={data.amount} />
                  </Col>
                  <Col md={4}>
                    <RenderInformation title="GL Account" description={data.gl_account} />
                  </Col>
                </Row>
                <Row className="gx-0">
                  <Col>
                    <RenderInformation title="Description" description={data.description} />
                  </Col>
                </Row>
              </Card>
              <div className="page-break auto" />
              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 mb-3 bg-transparent text-start">
                  <p className="fw-bold m-0 text-primary">Security Deposit</p>
                  <p className="small mb-0">Provide information regarding the security deposit</p>
                </Card.Header>
                <Row className="gx-0">
                  <Col md={4}>
                    <RenderInformation title="Amount" description={'-'} />
                  </Col>
                </Row>
              </Card>
              <div className="page-break auto" />
              {unit_id && unit_id > 0 && (
                <div className="page-section print-hidden">
                  <TableWithPagination
                    clickable
                    shadow={false}
                    showTotal={false}
                    pageHeader={<p className="fw-bold m-0 text-primary">Charges Information</p>}
                    saveValueInState
                    showHeaderInsideContainer
                    wrapperClass="detail-section-table"
                    newRecordButtonPermission={PERMISSIONS.LEASING}
                    searchable={false}
                    columns={[
                      {
                        Header: 'Title',
                        accessor: 'title',
                      },
                      {
                        Header: 'GL account',
                        accessor: 'gl_account',
                      },
                      {
                        Header: 'Amount',
                        accessor: 'amount',
                        Cell: ItemPrice,
                      },
                      {
                        Header: 'Date',
                        accessor: 'created_at',
                        Cell: ItemDate,
                      },
                    ]}
                    useData={useGetChargesQuery}
                    filterValues={{ unit: unit_id.toString() }}
                    onRowClick={row => {
                      if (row.original) {
                        const charge = row.original;
                        if ('id' in charge) {
                          redirect(`/accounts/receivables/charges/${charge.id}/details`, false, 'leasing');
                        }
                      }
                    }}
                  />
                </div>
              )}
            </PageContainer>
            <div className="page-break always" />
            <div className="print-visible">
              <h1 className="position-relative container fs-6 fw-bold text-center my-5">
                <hr className="m-0" />
                <span className="position-absolute top-50 left-50 translate-middle bg-light px-3">
                  Terms & Conditions
                </span>
              </h1>
              <PageContainer className="page-section print-body">
                <div className="p-4 my-3">
                  <LeaseAgreement
                    lease={data}
                    type="preview"
                    property={property_id}
                    applicant_name={applicant_name}
                    unit_name={unit_name}
                  />
                </div>
              </PageContainer>
            </div>
          </div>
        );
      }}
    />
  );
};

export default Details;
