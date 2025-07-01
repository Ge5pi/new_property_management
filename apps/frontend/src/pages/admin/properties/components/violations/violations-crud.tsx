import { useCallback, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';

import { CustomSelect } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';

import { IFileIDs } from 'interfaces/IAttachments';

const ViolationsCRUD = () => {
  const [files, setFiles] = useState<Array<IFileIDs>>([]);

  const onDrop = useCallback((acceptedFiles: Array<File>) => {
    const accepted: Array<IFileIDs> = [];
    acceptedFiles.map(file =>
      accepted.push({
        id: new Date().getTime().valueOf(),
        file,
      })
    );

    setFiles(prev => [...prev, ...accepted]);
  }, []);

  return (
    <PageContainer>
      <div className="container-fluid page-section pt-4 pb-3">
        <Form className="text-start">
          <Card className="border-0">
            <Card.Header className="border-0 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Add new Violation form</p>
              <p className="small">Provide the details bellow to add a violation</p>
            </Card.Header>
            <Card.Body className="px-0 text-start">
              <Container fluid>
                <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                  <Col lg={6} md={8}>
                    <Form.Group className="mb-4" controlId="ViolationFormHomeOwner">
                      <Form.Label className="popup-form-labels">Home Owner</Form.Label>
                      <Form.Control autoFocus type="text" placeholder="Search home owner" />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                  <Col xl={7} md={8}>
                    <Row className="gx-3">
                      <Col lg={4} sm={6}>
                        <Form.Group className="mb-4" controlId="ViolationFormViolationDate">
                          <Form.Label className="popup-form-labels">Violation Date</Form.Label>
                          <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                        </Form.Group>
                      </Col>
                      <Col lg={4} sm={6}>
                        <CustomSelect
                          name="violation_category"
                          labelText="Violation Category"
                          controlId="ViolationFormCategory"
                          options={[]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                          placeholder="Select"
                        />
                      </Col>
                      <Col lg={4} sm={6}>
                        <CustomSelect
                          name="violation_type"
                          labelText="Violation Type"
                          controlId="ViolationFormType"
                          options={[]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                          placeholder="Select"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="gb-4 gx-sm-5 gx-0">
                  <Col xl={4} md={6}>
                    <Form.Group className="mb-4" controlId="ViolationFormDescription">
                      <Form.Label className="popup-form-labels">Description</Form.Label>
                      <Form.Control placeholder="Some test here..." as="textarea" rows={5} />
                    </Form.Group>
                  </Col>
                  <Col xl={4} md={6}>
                    <Form.Group className="mb-4" controlId="ViolationFormActionRequired">
                      <Form.Label className="popup-form-labels">Action Required</Form.Label>
                      <Form.Control placeholder="Some test here..." as="textarea" rows={5} />
                    </Form.Group>
                  </Col>
                </Row>
                <Row className="align-items-stretch gx-sm-5 gx-0">
                  <Col xl={7} md={8}>
                    <Row className="gx-3">
                      <Col lg={4} sm={6}>
                        <CustomSelect
                          name="stage_of_violation"
                          labelText="Stage of Violation"
                          controlId="ViolationFormStage"
                          options={[{ label: '1st Notice', value: '1st Notice' }]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                        />
                      </Col>
                      <Col lg={4} sm={6}>
                        <GroupedField
                          wrapperClass="mb-4"
                          labelClass="form-label-md"
                          controlId="ViolationFormDeadline"
                          icon={'Days'}
                          position="end"
                          label="Deadline"
                          min="0"
                          type="number"
                          placeholder="0"
                        />
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="gb-4 gx-sm-5 gx-0 justify-content-between">
                  <Col xs={12}>
                    <Form.Group className="mb-4" controlId="ViolationFormAttachments">
                      <Dropzone onDrop={onDrop} styles={{ minHeight: 320 }} accept={FILE_TYPES_DOCS_IMAGES} />
                    </Form.Group>
                    {files.length > 0 && (
                      <Row className="gx-0 align-items-stretch justify-content-end">
                        {files.map((file, indx) => (
                          <Col key={indx} lg={6} md={12} sm={6} xs={12}>
                            <FileAttachments file={file.file} />
                          </Col>
                        ))}
                      </Row>
                    )}
                  </Col>
                </Row>
              </Container>
            </Card.Body>
            <Card.Footer className="px-0 bg-transparent border-0">
              <Stack direction="horizontal" gap={2} className="justify-content-end">
                <Button variant="light border-primary" className="px-4 py-1 me-3">
                  Cancel
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

export default ViolationsCRUD;
