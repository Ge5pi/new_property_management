import { useCallback, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';

import { CustomSelect } from 'core-ui/custom-select';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';

import { IFileIDs } from 'interfaces/IAttachments';

interface IProps {
  state: string;
}

const ArchitecturalReviewCRUD = ({ state = '' }: IProps) => {
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
              <p className="fw-bold m-0 text-primary">
                {state === '#/create'
                  ? 'Add new architectural review'
                  : state === '#/edit'
                    ? 'Update Current architectural review'
                    : ''}
              </p>
              <p className="small">You can make changes if required</p>
            </Card.Header>
            <Card.Body className="px-0 text-start">
              <Container fluid>
                <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                  <Col lg={6} md={8}>
                    <CustomSelect
                      name="homeowner"
                      labelText="Select homeowner"
                      controlId="ArchitecturalReviewFormBoardMember"
                      options={[
                        { label: 'President', value: 'President' },
                        { label: 'Vice President', value: 'Vice President' },
                      ]}
                      classNames={{
                        labelClass: 'popup-form-labels',
                        wrapperClass: 'mb-4',
                      }}
                    />
                  </Col>
                </Row>
                <Row className="gb-4 gx-sm-5 gx-0 justify-content-between">
                  <Col lg={6} md={7}>
                    <Form.Group className="mb-4" controlId="ArchitecturalReviewFormDescription">
                      <Form.Label className="popup-form-labels">Description</Form.Label>
                      <Form.Control placeholder="Some test here..." as="textarea" rows={5} />
                    </Form.Group>

                    <Row className="gx-0 py-2 my-1 justify-content-start align-items-start">
                      <Form.Group as={Col} xs={'auto'} controlId="ArchitecturalReviewFormStatus">
                        <Card.Text className="popup-form-labels px-0 me-sm-3 me-2">Status</Card.Text>
                      </Form.Group>
                      <Form.Group as={Col} xs={'auto'} controlId="ArchitecturalReviewFormStatusPending">
                        <Form.Check
                          type={'radio'}
                          label={`Pending`}
                          defaultChecked
                          className="small text-primary"
                          name="status"
                        />
                      </Form.Group>
                      <Form.Group
                        as={Col}
                        xs={'auto'}
                        className="ms-3"
                        controlId="ArchitecturalReviewFormStatusReviewAgain"
                      >
                        <Form.Check
                          type={'radio'}
                          label={`Review again`}
                          className="small text-primary"
                          name="status"
                        />
                      </Form.Group>
                    </Row>

                    <Form.Group className="mb-4" controlId="ArchitecturalReviewFormAttachments">
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

export default ArchitecturalReviewCRUD;
