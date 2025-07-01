import { Button, Card, Col, Row, Stack } from 'react-bootstrap';

import { CalendarIcon, EmailIcon, MoreHIcon, PhoneIcon } from 'core-ui/icons';
import { Avatar } from 'core-ui/user-avatar';

import { useWindowSize } from 'hooks/useWindowSize';

const SingleBoardOfDirector = () => {
  const [width] = useWindowSize();

  return (
    <Card className="single-section-item">
      <Card.Body>
        <Row className="gx-0 align-items-center justify-content-between single-info-item">
          <Col sm={'auto'} xs={12}>
            <Stack direction={`${width < 375 ? 'vertical' : 'horizontal'}`} gap={width < 375 ? 2 : 3}>
              <Avatar name="Mr. John Doe" size={50} />
              <div className="d-inline-block">
                <p className="fw-bold text-primary fw-bold m-0">Mr. John Doe</p>
                <p className="text-primary m-0">Directorial head of committee</p>
                <div className="d-flex align-items-center single-info-item-text text-muted">
                  <CalendarIcon size="16" />
                  <p className="mx-1 mb-0">12/05/2022 - 15/12/2022</p>
                </div>
              </div>
            </Stack>
          </Col>
          <Col xl={6} lg={5} md={6} sm xs={12}>
            <Row className="g-0 ms-md-3 ms-sm-4 ms-0 mt-sm-0 mt-3 gy-md-0 gy-sm-2 align-items-center single-info-item-text">
              <Col>
                <Stack direction="horizontal">
                  <div className="me-2">
                    <PhoneIcon />
                  </div>
                  <Card.Text>+92 90078601</Card.Text>
                </Stack>
              </Col>
              <Col>
                <Stack direction="horizontal">
                  <div className="me-2">
                    <EmailIcon />
                  </div>
                  <Card.Text>johndoe@example.com</Card.Text>
                </Stack>
              </Col>
            </Row>
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

export default SingleBoardOfDirector;
