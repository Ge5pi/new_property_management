import { Card, Col, Row } from 'react-bootstrap';

import HScroll from 'core-ui/h-scroll/h-scroll';
import { RenderInformation } from 'core-ui/render-information';

import { getCountry } from 'utils/functions';

import { ISingleRentalForm } from 'interfaces/IApplications';

interface IProps {
  rental_application: ISingleRentalForm;
}

const ResidentialHistory = ({ rental_application }: IProps) => {
  if (!rental_application.residential_history || rental_application.residential_history.length <= 0) {
    return null;
  }

  return (
    <Card className="border-0 p-4 page-section my-3">
      <Card.Body className="border-0 p-0">
        <HScroll
          itemClassName="col-12"
          scrollContainerClassName="row align-items-center gx-3 gy-3 flex-nowrap"
          arrowsPos={{ position: 'end', show: 'head' }}
          headerTitle={
            <Card.Header className="border-0 p-0 mb-4 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Residential History</p>
              <p className="small">This sections includes information regarding tenant previous residential details</p>
            </Card.Header>
          }
        >
          {rental_application.residential_history.map(({ id, ...history }) => (
            <div key={id}>
              <Row className="gx-3 gy-4">
                <Col>
                  <RenderInformation title="Current Address" description={history.current_address} />
                </Col>
              </Row>
              <Row className="gx-3 gy-4">
                <Col>
                  <RenderInformation title="Address 2" description={history.current_address_2} />
                </Col>
              </Row>

              <Row className="gx-3 gy-4">
                <Col xl={2} lg={4} md={6}>
                  <RenderInformation title="City" description={history.current_city} />
                </Col>
                <Col xl={2} lg={4} md={6}>
                  <RenderInformation title="Zip Code" description={history.current_zip_code} />
                </Col>
                <Col xl={2} lg={4} md={6}>
                  <RenderInformation title="Country" description={getCountry(history.current_country)} />
                </Col>
              </Row>
              <Row className="gx-3 gy-4">
                <Col xl={2} lg={4} md={6}>
                  <RenderInformation title="Resided from" description={history.resident_from} />
                </Col>
                <Col xl={2} lg={4} md={6}>
                  <RenderInformation title="Resided to" description={history.resident_to} />
                </Col>
              </Row>
              <RenderInformation title="Monthly Rent" desClass="price-symbol" description={history.monthly_rent} />
              <RenderInformation title="Landlord Name" description={history.landlord_name} />
              <Row className="gx-3 gy-4">
                <Col xl={4} md={6}>
                  <RenderInformation title="Landlord Phone number" phone={history.landlord_phone_number} />
                </Col>
                <Col xl={4} md={6}>
                  <RenderInformation title="Landlord Email" email={history.landlord_email} />
                </Col>
              </Row>
              <Row className="gx-3 gy-4">
                <Col md={6}>
                  <RenderInformation title="Reason for leaving" description={history.reason_of_leaving} />
                </Col>
              </Row>
            </div>
          ))}
        </HScroll>
      </Card.Body>
    </Card>
  );
};

export default ResidentialHistory;
