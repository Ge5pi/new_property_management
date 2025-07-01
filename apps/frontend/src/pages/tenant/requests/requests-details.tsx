import { Fragment, useCallback } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { getSignedURL } from 'api/core';
import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetServiceRequestAttachmentsQuery } from 'services/api/service-requests';
import { useGetTenantByIdQuery } from 'services/api/tenants';
import { useGetTenantServiceRequestsByIdQuery } from 'services/api/tenants/service-requests';
import { useGetUnitByIdQuery } from 'services/api/units';

import { BackButton } from 'components/back-button';
import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import Skeleton, { InformationSkeleton, InlineSkeleton, PropertySkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { RenderInformation } from 'core-ui/render-information';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import { getIDFromObject, getValidID } from 'utils/functions';

const ServiceRequestsDetails = () => {
  const [width] = useWindowSize();
  const { request } = useParams();

  const service_request = useGetTenantServiceRequestsByIdQuery(getValidID(request));
  const attachments = useGetServiceRequestAttachmentsQuery(getValidID(request));

  const unit = useGetUnitByIdQuery(getIDFromObject('unit', service_request.data));
  const property = useGetPropertyByIdQuery(getIDFromObject('property_id', service_request.data));

  const tenant = useGetTenantByIdQuery(getIDFromObject('tenant_id', service_request.data));
  const { redirect } = useRedirect();

  const handleAttachmentClick = useCallback((file: string, request_id: number) => {
    if (file && request_id) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  return (
    <ApiResponseWrapper
      {...service_request}
      renderResults={data => {
        return (
          <div className="my-3">
            <PageContainer className="mt-3">
              <BackButton />
              <Stack direction="horizontal" className="justify-content-between">
                <h1 className="fw-bold h4 mt-1">Service Request Details</h1>
                <EditBtn onClick={() => redirect(`/requests/${data.id}/modify/`, false, 'requests')} />
              </Stack>
              <div className="container-fluid page-section pt-3 pb-3 mt-3">
                <Row>
                  <Col>
                    <p className="fw-bold fs-5 text-uppercase">{data.slug ?? 'N/A'}</p>
                  </Col>
                  <Col xs={'auto'}>
                    <p
                      className={clsx(
                        'fw-medium text-capitalize',
                        { 'text-success': data.status === 'COMPLETED' },
                        { 'text-info': data.status === 'PENDING' }
                      )}
                    >
                      {(data.status ?? '-').toLowerCase().replaceAll('_', ' ')}
                    </p>
                  </Col>
                  <Col xs={'auto'}>
                    <p className="text-end fw-medium text-muted mb-0">12/05/2022</p>
                    <p className="text-end fw-medium text-muted">
                      <ApiResponseWrapper
                        {...tenant}
                        loadingComponent={<Skeleton xs={12} as="span" />}
                        showError={false}
                        hideIfNoResults
                        renderResults={t_data => (
                          <span>
                            {t_data.first_name} {t_data.last_name}
                          </span>
                        )}
                      />
                    </p>
                  </Col>
                </Row>
                <Card>
                  <Row className="g-lg-4 g-md-0 align-items-center">
                    <Col xl={width > 1440 ? 3 : 4} lg={5} md={6}>
                      <ApiResponseWrapper
                        {...unit}
                        hideIfNoResults
                        showError={false}
                        loadingComponent={<PropertySkeleton inverse />}
                        renderResults={unit_data => (
                          <Card.Header className="border-0 pt-3 bg-transparent">
                            <Card.Img as={LazyImage} src={unit_data.cover_picture} border size="16x9" />
                            <ApiResponseWrapper
                              {...property}
                              hideIfNoResults
                              showError={false}
                              loadingComponent={<Skeleton xs={12} />}
                              renderResults={property_data => (
                                <Card.Title className="mt-2 fw-bold text-capitalize">{property_data.name}</Card.Title>
                              )}
                            />
                            <Card.Subtitle className="small mb-3">{unit_data.name}</Card.Subtitle>
                          </Card.Header>
                        )}
                      />
                    </Col>
                    <Col xl={6} md={6}>
                      <Card.Body className="border-0">
                        <RenderInformation title="Subject" description={data.subject} />
                        <RenderInformation
                          title="Description"
                          html={
                            <Fragment>
                              <RenderInformation
                                title=""
                                desClass="mb-1"
                                containerMargin={false}
                                description={data.description}
                              />
                              {data.additional_information_for_entry && (
                                <RenderInformation
                                  title=""
                                  containerMargin={false}
                                  description={data.additional_information_for_entry}
                                />
                              )}
                            </Fragment>
                          }
                        />
                        <Row className="g-sm-4">
                          <Col lg={{ span: 'auto', offset: 9 }}>
                            <RenderInformation
                              title="Permission to enter"
                              description={data.permission_to_enter ? 'Yes' : 'No'}
                            />
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>

                <Row className="mt-1 gx-3 gy-4 align-items-stretch">
                  <Col lg={{ span: 5, offset: 7 }} md={{ span: 6, offset: 6 }}>
                    <Card className="min-h-100">
                      <Card.Header className="border-0 py-3 bg-transparent text-start">
                        <p className="fw-bold m-0 text-primary">Resident Details</p>
                      </Card.Header>
                      <Card.Body className="border-0">
                        <ApiResponseWrapper
                          {...tenant}
                          loadingComponent={
                            <InformationSkeleton skeletonType="column" columnCount={3} sm={6}>
                              <InformationSkeleton lines="single" />
                            </InformationSkeleton>
                          }
                          showError={false}
                          hideIfNoResults
                          renderResults={t_data => (
                            <Row className="g-sm-4">
                              <Col xs="12">
                                <RenderInformation
                                  title="Tenant Name"
                                  description={`${t_data.first_name} ${t_data.last_name}`}
                                />
                              </Col>
                              <Col sm={6}>
                                <RenderInformation title="Phone Number" phone={t_data.phone_number} />
                              </Col>
                              <Col sm={6}>
                                <RenderInformation title="Pets" description="N/A" />
                              </Col>
                            </Row>
                          )}
                        />
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
                <Card className="my-3 border-0">
                  <Card.Body>
                    <ApiResponseWrapper
                      {...attachments}
                      hideIfNoResults
                      showError={false}
                      loadingComponent={
                        <InformationSkeleton xxl={5} lg={8} md={7} columnCount={4} skeletonType="column">
                          <Card className="border-0 bg-light shadow-sm">
                            <Card.Body>
                              <Skeleton style={{ width: 25, height: 25 }} />
                              <InlineSkeleton xs={8} />
                            </Card.Body>
                          </Card>
                        </InformationSkeleton>
                      }
                      renderResults={attachment => {
                        return (
                          <Row className="g-3">
                            {attachment.length > 0 && (
                              <Col xs={12}>
                                <p className="fw-medium mb-0 text-primary">Attachments</p>
                              </Col>
                            )}
                            {attachment.map((file, indx) => (
                              <Col key={indx} xx={3} xl={4} lg={5} sm={6}>
                                <FilePreview
                                  name={file.name}
                                  fileType={file.file_type.toLowerCase()}
                                  onClick={() => handleAttachmentClick(file.file, Number(request))}
                                  bg="secondary"
                                />
                              </Col>
                            ))}
                          </Row>
                        );
                      }}
                    />
                  </Card.Body>
                </Card>
              </div>
            </PageContainer>
          </div>
        );
      }}
    />
  );
};

export default ServiceRequestsDetails;
