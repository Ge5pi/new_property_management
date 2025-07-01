import { Card, Col, Row } from 'react-bootstrap';

import { RenderInformation } from 'core-ui/render-information';

const BalanceSummary = () => {
  return (
    <Card className="border-0 min-h-100 page-section">
      <Card.Header className="border-0 py-3 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Summary amounts this month</p>
      </Card.Header>
      <Card.Body className="text-start">
        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Balance" description="$250" desClass="fw-bold text-success" />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Rent" description="$5,000" desClass="fw-bold text-success" />
          </Col>
        </Row>

        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Total charges" description="$250" desClass="fw-bold text-success" />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Total credits" description="$250" desClass="fw-bold text-success" />
          </Col>
        </Row>

        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Due amount" description="$200" desClass="fw-bold text-success" />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Total payable" description="$250" desClass="fw-bold text-success" />
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default BalanceSummary;
