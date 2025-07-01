import { Card, Col, Row } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetLeasesTenantsQuery } from 'services/api/lease';

import { HScroll } from 'core-ui/h-scroll';
import { RenderInformation } from 'core-ui/render-information';

import { getIDFromObject } from 'utils/functions';

import { ILeaseForm } from 'interfaces/IApplications';

interface IProps {
  lease: ILeaseForm;
}

const SecondaryResident = ({ lease }: IProps) => {
  const secondary_tenants = useGetLeasesTenantsQuery(getIDFromObject('id', lease));

  return (
    <ApiResponseWrapper
      {...secondary_tenants}
      hideIfNoResults
      renderResults={tenants => (
        <Card className="border-0 p-4 page-section my-3">
          <Card.Body className="border-0 p-0">
            <HScroll
              itemClassName="col-12"
              scrollContainerClassName="row align-items-center gx-3 gy-3 flex-nowrap"
              arrowsPos={{ position: 'end', show: 'head' }}
              headerTitle="Secondary Tenant"
              subtitle="This sections includes information regarding the secondary tenant"
            >
              {tenants.map(tenant => {
                return (
                  <div key={tenant.id}>
                    <RenderInformation title="Tenant Name" description={`${tenant.first_name} ${tenant.last_name}`} />
                    <Row className="g-sm-4">
                      <Col sm>
                        <RenderInformation title="Mobile Number" phone={tenant.phone_number} />
                      </Col>
                      <Col sm>
                        <RenderInformation title="Email" email={tenant.email} />
                      </Col>
                    </Row>
                    <RenderInformation title="Date of Birth" description={`${tenant.birthday}`} />
                    <RenderInformation title="Tax Payer ID" description={`${tenant.tax_payer_id}`} />
                  </div>
                );
              })}
            </HScroll>
          </Card.Body>
        </Card>
      )}
    />
  );
};

export default SecondaryResident;
