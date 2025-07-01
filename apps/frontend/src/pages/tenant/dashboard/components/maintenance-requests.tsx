import { Fragment } from 'react';
import { Card, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetTenantServiceRequestsQuery } from 'services/api/tenants/service-requests';

import { LazyImage } from 'core-ui/lazy-image';

import { IListServiceRequest } from 'interfaces/IServiceRequests';

function MaintenanceRequest() {
  const service_requests = useGetTenantServiceRequestsQuery({ size: 5, page: 1 });

  return (
    <Card className="page-section border min-h-100">
      <Card.Header className="p-0 bg-transparent px-4 py-3 border">
        <h2 className="fw-bold fs-5 m-0">Maintenance Requests</h2>
      </Card.Header>
      <Card.Body className="p-0 overflow-auto" style={{ maxHeight: 450 }}>
        <ApiResponseWrapper
          {...service_requests}
          showMiniError
          renderResults={data => {
            const requests: Array<IListServiceRequest | string> = [...data.results];
            if (data.count > 12) {
              requests.push('record-view-all');
            }

            if (data.results.length <= 0) {
              return (
                <div className="position-relative d-flex justify-content-between px-4 py-5 my-5">
                  <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                    No Record Found
                  </div>
                </div>
              );
            }

            return (
              <Fragment>
                {requests.map(request =>
                  typeof request === 'string' ? (
                    <Link key={request} to={`/tenant/requests`}>
                      <div className="position-relative border-bottom last-border-0 d-flex justify-content-between px-4 py-2">
                        <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                          view all
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <Link
                      key={request.id}
                      to={`/tenant/requests/details/${request.id}`}
                      className="text-decoration-none"
                    >
                      <div className="border-bottom last-border-0 p-0 d-flex justify-content-between px-4 py-3 item-hover">
                        <Stack
                          direction="horizontal"
                          className="align-items-start flex-custom-item justify-content-start"
                          gap={3}
                        >
                          <LazyImage src={request.unit_cover_picture?.image} border size="sm" preview={false} />

                          <div className="item-content text-start col-lg">
                            <p className="fw-bold m-0" style={{ lineHeight: 1.5 }}>
                              {request.unit_name}
                            </p>
                            <p className="text-capitalize small text-muted m-0" style={{ lineHeight: 1.25 }}>
                              Maintenance for <span className="fw-bold">{request.property_name}</span>
                            </p>
                            <p className="text-warning small fw-medium m-0 text-capitalize">
                              {request.status?.toLowerCase().replaceAll('_', ' ')}{' '}
                              <span className="d-inline-block fs-6 me-2 bg-warning rounded p-1" />
                            </p>
                          </div>
                        </Stack>
                      </div>
                    </Link>
                  )
                )}
              </Fragment>
            );
          }}
        />
      </Card.Body>
    </Card>
  );
}

export default MaintenanceRequest;
