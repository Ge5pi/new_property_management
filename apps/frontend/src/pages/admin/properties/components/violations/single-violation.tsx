import { Button, Card, Col, Row, Stack } from 'react-bootstrap';

import { MoreHIcon } from 'core-ui/icons';

const SingleViolation = () => {
  return (
    <Card className="single-section-item">
      <Card.Body>
        <Stack direction="horizontal" className="align-items-start justify-content-between">
          <div className="me-3">
            <p className="fw-bold text-primary fw-bold m-0">Violation Type Here</p>
            <p className="fw-light small text-muted mb-1">Category here</p>
            <p className="fw-medium">Address over here ipsum dolor sit amet, consectetur adipiscing elit. Quis ut</p>
          </div>
          <Button variant="light" className="p-1 bg-transparent" onClick={e => e.stopPropagation()} size={'sm'}>
            <MoreHIcon />
          </Button>
        </Stack>
        <Row className="gx-0 gy-md-0 gy-2 justify-content-between">
          <Col xl={2} md={4} sm={6} xs={'auto'}>
            <div className="me-md-3">
              <p className="fw-light mb-1">Owner</p>
              <p className="text-primary fw-medium">Mr. John Doe</p>
            </div>
          </Col>
          <Col xl={2} md={3} sm={6} xs={'auto'}>
            <div className="me-md-3">
              <p className="fw-light mb-1">Unit</p>
              <p className="text-primary fw-medium">Demo Unit Title here</p>
            </div>
          </Col>
          <Col md={'auto'} sm={6} xs={'auto'}>
            <div className="me-md-3">
              <p className="fw-light mb-1">Stage </p>
              <p className="text-warning fw-medium">2nd Notice</p>
            </div>
          </Col>
          <Col md={'auto'} sm={6} xs={'auto'}>
            <div className="me-md-3">
              <p className="fw-light mb-1">Violation date</p>
              <p className="fw-medium">12/05/2022</p>
            </div>
          </Col>
          <Col xl={2} md={'auto'} sm={6} xs={'auto'}>
            <div className="text-danger me-md-3">
              <p className="fw-light mb-1">Deadline</p>
              <p className="fw-medium">12/05/2022</p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SingleViolation;
