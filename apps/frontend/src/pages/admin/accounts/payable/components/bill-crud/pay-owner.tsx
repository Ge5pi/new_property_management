import { Button, Card, Col, Form, ListGroup, Row, Stack } from 'react-bootstrap';

import { Formik } from 'formik';

import { BackButton } from 'components/back-button';

import { TrashIcon } from 'core-ui/icons';

const PayOwner = () => {
  const onSubmit = () => {
    console.log('::: values');
  };

  return (
    <div>
      <Formik
        className="text-start"
        onSubmit={onSubmit}
        initialValues={{
          property: '',
          run_as_of: '',
        }}
      >
        {() => (
          <>
            <Stack className="justify-content-between" direction="horizontal">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1">Pay owner fee ID-213</h1>
              </div>
              <div>
                <Button variant="light border-primary" className="px-4 py-1 me-3">
                  Cancel
                </Button>
                <Button variant="primary" type="submit" className="px-4 py-1">
                  Save
                </Button>
              </div>
            </Stack>

            <Card className="border-0 p-4 page-section mb-3">
              <Card.Header className="border-0 p-0 bg-transparent text-start">
                <Stack direction="horizontal" className="justify-content-between">
                  <div>
                    <p className="fw-bold m-0 text-primary">Bill Details</p>
                    <p className="small">Basic Information of this bill</p>
                  </div>
                  <Button className="mb-auto shadow-none btn btn-link bg-transparent text-decoration-none d-inline-flex align-items-center">
                    <TrashIcon color="#fc3939" /> <small className="text-danger ms-2">Delete</small>
                  </Button>
                </Stack>
              </Card.Header>

              <Card.Body className="p-0 mt-4">
                <Row className="mt-1 gx-3">
                  <Col md={6}>
                    <Stack direction="horizontal" className="gap-4 mb-3">
                      <Form.Control type="text" placeholder="Type & search" name="username" />

                      <Button variant="primary" type="submit" className=" px-5">
                        Search
                      </Button>
                    </Stack>
                  </Col>
                </Row>
                <Row className="mt-1 gx-3 align-items-stretch">
                  <Col md={6}>
                    <Card className="bg-transparent border-0">
                      <Card.Header className="border-0 py-3 bg-transparent text-start px-0">
                        <p className="fw-bold m-0 text-primary">Properties</p>
                      </Card.Header>
                      <Card.Body className="pt-0 fixed-assets-list ps-0" style={{ maxHeight: 306, overflow: 'auto' }}>
                        <ListGroup>
                          {/* selected property */}
                          <ListGroup.Item className="px-3 border-primary">
                            <p className="m-0">Demo Property</p>
                          </ListGroup.Item>
                          {[...Array(10)].map((_, i) => (
                            <ListGroup.Item className="px-3" key={`${Math.random()} ${i}`}>
                              <p className="m-0">Demo Property</p>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="bg-transparent border-0">
                      <Card.Header className="border-0 py-3 bg-transparent text-start px-0">
                        <p className="fw-bold m-0 text-primary">Property owners</p>
                      </Card.Header>
                      <Card.Body className="pt-0 fixed-assets-list ps-0" style={{ maxHeight: 306, overflow: 'auto' }}>
                        <ListGroup variant="flush">
                          {[...Array(6)].map((_, i) => (
                            <ListGroup.Item className="px-3" key={`${Math.random()} ${i}`}>
                              <Stack direction="horizontal" className="align-items-center justify-content-between">
                                <p className="m-0">Demo Property</p>

                                <p className="m-0 fw-medium border border-primary px-2">500.00 $</p>
                              </Stack>
                            </ListGroup.Item>
                          ))}
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </>
        )}
      </Formik>
    </div>
  );
};

export default PayOwner;
