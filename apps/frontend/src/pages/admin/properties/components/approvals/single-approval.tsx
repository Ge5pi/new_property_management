import { Button, Card, Col, Row, Stack } from 'react-bootstrap';

import { DotIcon, MoreHIcon } from 'core-ui/icons';

import { useWindowSize } from 'hooks/useWindowSize';

const SingleApproval = () => {
  const [width] = useWindowSize();

  return (
    <Card className="single-section-item">
      <Card.Body>
        <Row className="gx-0 gy-md-0 gy-2 align-items-lg-center justify-content-between single-info-item">
          <Col xl={6} lg={4} md={5} xs={12}>
            <Stack className="single-info-item-title" direction={`${width < 425 ? 'vertical' : 'horizontal'}`} gap={2}>
              <Card.Title className="fw-bold fs-6 fw-bold mb-sm-1 mb-0">Demo Approval Name </Card.Title>
              <p className="text-success fw-medium mb-sm-1 mb-0">
                Approved
                <span className="mx-1">
                  <DotIcon />
                </span>
              </p>
            </Stack>
            <Card.Subtitle className="small mb-sm-1 mb-0">Description text will be shown over here...</Card.Subtitle>
          </Col>
          <Col xs={'auto'}>
            <div className="me-5">
              <p className="fw-light mb-1">Amount</p>
              <p className="text-primary fw-medium">$5,000</p>
            </div>
          </Col>
          <Col xs={'auto'}>
            <div className="me-5">
              <p className="fw-light mb-1">Due date </p>
              <p className="text-primary fw-medium">12/05/2022</p>
            </div>
          </Col>
          <Col xs={'auto'}>
            <div className="me-5">
              <p className="fw-light mb-1">Approved by</p>
              <p className="text-primary fw-medium">Mr. John Doe</p>
            </div>
          </Col>
          <Col xs={'auto'} className="single-info-item-wrap">
            <Button variant="light" className="p-1 bg-transparent" onClick={e => e.stopPropagation()} size={'sm'}>
              <MoreHIcon />
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SingleApproval;
