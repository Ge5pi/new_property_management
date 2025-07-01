import { Button, Card, Col, Form, ListGroup, Row, Stack } from 'react-bootstrap';

import { Formik } from 'formik';

import { BackButton } from 'components/back-button';

import { TrashIcon } from 'core-ui/icons';
import { LazyImage } from 'core-ui/lazy-image';
import { RenderInformation } from 'core-ui/render-information';

const TransferFunds = () => {
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
                <h1 className="fw-bold h4 mt-1">Transfer funds ID-213</h1>
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
                    <p className="fw-bold m-0 text-primary mb-2">From property</p>

                    <Stack direction="horizontal" className="gap-4 mb-3">
                      <Form.Control type="text" placeholder="Type & search" name="from_property" />

                      <Button variant="primary" type="submit" className="px-5">
                        Search
                      </Button>
                    </Stack>

                    <Card className="align-items-center p-3">
                      <Card.Img as={LazyImage} src="" size="21x9" />
                      <Card.Body className="mt-3 ps-0 w-100 pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start">
                        <Card.Title className="fw-semibold capitalize mb-4">Property name</Card.Title>

                        <Row>
                          <Col md={4}>
                            <RenderInformation title="Available funds" description="500 $" />
                          </Col>
                          <Col md={4}>
                            <RenderInformation title="Reserve amount" description="500 $" />
                          </Col>
                          <Col md={4}>
                            <RenderInformation title="Pending receipts" description="500 $" />
                          </Col>
                        </Row>

                        <Card.Text className="fw-semibold">Owners</Card.Text>
                        <ListGroup as="ol" numbered className="borderless fw-medium">
                          <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
                          <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
                          <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <p className="fw-bold m-0 text-primary mb-2">To property</p>

                    <Stack direction="horizontal" className="gap-4 mb-3">
                      <Form.Control type="text" placeholder="Type & search" name="to_property" />

                      <Button variant="primary" type="submit" className=" px-5">
                        Search
                      </Button>
                    </Stack>

                    <Card className="align-items-center p-3">
                      <Card.Img as={LazyImage} src="" wrapperClass="mb-3" size="21x9" />
                      <Card.Body className="ps-0 w-100 pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start">
                        <Card.Title className="fw-semibold capitalize mb-4">Property name</Card.Title>

                        <Row>
                          <Col md={4}>
                            <RenderInformation title="Available funds" description="500 $" />
                          </Col>
                          <Col md={4}>
                            <RenderInformation title="Reserve amount" description="500 $" />
                          </Col>
                          <Col md={4}>
                            <RenderInformation title="Pending receipts" description="500 $" />
                          </Col>
                        </Row>

                        <Card.Text className="fw-semibold">Owners</Card.Text>
                        <ListGroup as="ol" numbered className="borderless fw-medium">
                          <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
                          <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
                          <ListGroup.Item as="li">Cras justo odio</ListGroup.Item>
                        </ListGroup>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Stack direction="horizontal" className="justify-content-end mt-4 gap-4">
                  <Form.Group controlId="TransferFundsFormAmount">
                    <Form.Label className="popup-form-labels">Transfer Amount</Form.Label>
                    <Form.Control type="text" placeholder="" />
                  </Form.Group>
                  <Form.Group controlId="TransferFundsFormDate">
                    <Form.Label className="popup-form-labels">Transfer Date</Form.Label>
                    <Form.Control type="date" placeholder="" />
                  </Form.Group>
                  <Button variant="light border-primary" className="px-4 mt-5 mb-3">
                    Cancel
                  </Button>
                  <Button variant="primary" type="submit" className="px-4 mt-5 mb-3">
                    Transfer
                  </Button>
                </Stack>
              </Card.Body>
            </Card>
          </>
        )}
      </Formik>
    </div>
  );
};

export default TransferFunds;
