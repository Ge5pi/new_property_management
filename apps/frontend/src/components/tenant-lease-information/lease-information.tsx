import { Card } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetTenantLeasesByIdQuery } from 'services/api/tenants/leases';
import { useGetTenantsUserInformationQuery } from 'services/api/tenants/tenant';

import { RenderInformation } from 'core-ui/render-information';

import { getIDFromObject } from 'utils/functions';

function LeaseInformation() {
  const tenant = useGetTenantsUserInformationQuery();
  const tenantLease = useGetTenantLeasesByIdQuery(getIDFromObject('lease', tenant.data));
  const property = useGetPropertyByIdQuery(getIDFromObject('property_id', tenantLease.data));

  return (
    <Card className="page-section border min-h-100">
      <Card.Header className="p-0 bg-transparent px-4 py-3 border">
        <h2 className="fw-bold fs-5 m-0">Lease information</h2>
      </Card.Header>
      <ApiResponseWrapper
        {...tenantLease}
        showMiniError
        renderResults={lease => {
          if (!lease) {
            return (
              <Card className="my-2 border-0" style={{ minHeight: 'calc(100% - 1rem)' }}>
                <Card.Body className="position-relative py-5">
                  <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                    No Record Found
                  </div>
                </Card.Body>
              </Card>
            );
          }

          return (
            <Card.Body className="px-4 py-3 lh-sm">
              <RenderInformation
                title="Account number"
                titleClass="small text-muted"
                desClass="small"
                description={lease.gl_account}
              />

              <RenderInformation
                title="Address"
                titleClass="small text-muted"
                desClass="small"
                html={
                  <ApiResponseWrapper
                    {...property}
                    showMiniError
                    hideIfNoResults
                    renderResults={property_data => <span>{property_data.address}</span>}
                  />
                }
              />

              <RenderInformation
                desClass="small"
                title="Lease Start date"
                titleClass="small text-muted"
                date={lease.start_date}
              />
              <RenderInformation
                title="Lease end date"
                titleClass="small text-muted"
                desClass="small"
                date={lease.end_date}
              />

              <RenderInformation
                title="Rent"
                titleClass="small text-muted"
                desClass="price-symbol small"
                description={lease.amount}
              />

              <RenderInformation
                title="Deposits"
                titleClass="small text-muted"
                desClass="price-symbol small"
                description={0}
              />

              <RenderInformation
                title="Prepayments"
                titleClass="small text-muted"
                desClass="price-symbol small"
                description={0}
              />
            </Card.Body>
          );
        }}
      />
    </Card>
  );
}

export default LeaseInformation;
