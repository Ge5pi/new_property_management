import { Button, Card, Col, Row } from 'react-bootstrap';

import { DotIcon, MoreHIcon } from 'core-ui/icons';

import { useWindowSize } from 'hooks/useWindowSize';

const SingleArchitecturalReview = () => {
  const [width] = useWindowSize();

  return (
    <Card className="single-section-item">
      <Card.Body>
        <Row className="gx-0 gy-md-0 gy-2 align-items-lg-center justify-content-between single-info-item">
          <Col xs={'auto'}>
            <div className="me-3">
              <p className="fw-bold text-primary fw-bold mb-1">ID-123222</p>
              <p className="fw-medium text-success fw-medium">
                Approved
                <span className="mx-1">
                  <DotIcon />
                </span>
              </p>
            </div>
          </Col>
          <Col sm={'auto'} xs={12}>
            <div className="me-3">
              <p className="fw-light mb-1">Home owner</p>
              <p className="text-primary fw-medium">Mr. John Doe</p>
            </div>
          </Col>
          <Col sm={'auto'} xs className={width < 425 ? 'col-12' : ''}>
            <div className="me-3">
              <p className="fw-light mb-1">Association </p>
              <p className="text-primary fw-medium">Demo association name</p>
            </div>
          </Col>
          <Col sm={'auto'} xs>
            <div className="text-muted me-3">
              <p className="fw-light mb-1">Review request date</p>
              <p className="fw-medium">12/05/2022</p>
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

export default SingleArchitecturalReview;
