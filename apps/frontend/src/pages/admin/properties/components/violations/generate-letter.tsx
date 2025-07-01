import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';

import PageContainer from 'components/page-container';

import { CustomSelect } from 'core-ui/custom-select';
import { PreviewLetter } from 'core-ui/popups/violations';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

const GenerateLetter = () => {
  const handleLetterPreview = () => {
    SweetAlert({
      size: 'lg',
      html: <PreviewLetter />,
    }).fire({
      allowOutsideClick: () => !SwalExtended.isLoading(),
    });
  };

  return (
    <PageContainer>
      <div className="container-fluid page-section pt-4 pb-3">
        <Form className="text-start">
          <Card className="border-0">
            <Card.Header className="border-0 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Generate Letter</p>
              <p className="small">Add letter information over here</p>
            </Card.Header>
            <Card.Body className="px-0 text-start">
              <Container fluid>
                <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                  <Col lg={6} md={8}>
                    <Row className="gx-3 align-items-center">
                      <Col lg={6} md={8} sm={6}>
                        <CustomSelect
                          name="template"
                          labelText="Select Template"
                          controlId="GenerateLetterFormTemplate"
                          options={[]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                          placeholder="Select"
                        />
                      </Col>
                      <Col>
                        <Form.Group className="mb-4" controlId="GenerateLetterFormSenderName">
                          <p className="fw-normal mb-0">Sender Name</p>
                          <p className="text-primary fw-medium">Mr. John Doe</p>
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="gx-sm-5 gx-0">
                  <Col lg={4} sm={6}>
                    <Form.Group className="mb-4" controlId="GenerateLetterFormRecipient">
                      <Form.Label className="popup-form-labels">Recipient</Form.Label>
                      <Form.Control autoFocus type="text" placeholder="Search Recipient" />
                      <Form.Text>
                        Association address dolor sit amet, consectetur adipiscing elit. Venenatis nisl consequat.
                      </Form.Text>
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="gx-sm-5 gx-0">
                  <Col xl={4} md={6}>
                    <CustomSelect
                      labelText="Category"
                      name="violation_category"
                      controlId="GenerateLetterFormCategory"
                      options={[]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      placeholder="Select"
                    />
                  </Col>
                  <Col xl={4} md={6}>
                    <CustomSelect
                      labelText="Type"
                      name="violation_type"
                      controlId="GenerateLetterFormType"
                      options={[]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                      placeholder="Select"
                    />
                  </Col>
                </Row>
                <Row className="align-items-stretch gx-sm-5 gx-0">
                  <Col lg={6} md={8}>
                    <Row className="gx-3">
                      <Col lg={4} sm={6}>
                        <CustomSelect
                          name="stage"
                          labelText="Stage"
                          controlId="GenerateLetterFormStage"
                          options={[{ label: '1st Notice', value: '1st Notice' }]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                        />
                      </Col>
                      <Col lg={4} sm={6}>
                        <Form.Group className="mb-4" controlId="GenerateLetterFormDeadline">
                          <Form.Label className="popup-form-labels">Deadline</Form.Label>
                          <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
              </Container>
            </Card.Body>
            <Card.Footer className="px-0 bg-transparent border-0">
              <Stack direction="horizontal" gap={2} className="flex-wrap justify-content-sm-end justify-content-center">
                <Button variant="light" className="bg-transparent border-primary px-4 py-1">
                  Cancel
                </Button>

                <Button variant="light" onClick={handleLetterPreview} className="border-primary px-4 py-1">
                  Preview
                </Button>

                <Button variant="primary" className="px-4 py-1">
                  Save
                </Button>
              </Stack>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </PageContainer>
  );
};

export default GenerateLetter;
