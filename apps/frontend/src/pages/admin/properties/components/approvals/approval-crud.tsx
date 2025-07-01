import { useCallback, useState } from 'react';
import { Button, Card, Col, Container, Form, Row, Stack } from 'react-bootstrap';

import { clsx } from 'clsx';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import PageContainer from 'components/page-container';

import { CustomSelect } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';

import { useWindowSize } from 'hooks/useWindowSize';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';

import { IFileIDs } from 'interfaces/IAttachments';

interface IProps {
  state: string;
}

const ApprovalCRUD = ({ state = '' }: IProps) => {
  const [width] = useWindowSize();
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
                {state === '#/create' ? 'Add New Approval' : state === '#/edit' ? 'Update Current Approval' : ''}
              </p>
              <p className="small">You can make changes if required</p>
            </Card.Header>
            <Card.Body className="px-0 text-start">
              <Container fluid>
                <Row className="align-items-center gx-sm-5 gx-0 justify-content-between">
                  <Col lg={6} md={8}>
                    <Form.Group className="mb-4" controlId="ApprovalFormName">
                      <Form.Label className="popup-form-labels">Approval Name</Form.Label>
                      <Form.Control autoFocus type="text" placeholder="Enter approval name" />
                    </Form.Group>
                    <Row className="gx-3">
                      <Col xs={6}>
                        <GroupedField
                          wrapperClass="mb-4"
                          labelClass="form-label-md"
                          controlId="ApprovalFormAmount"
                          icon={'$'}
                          position="end"
                          label="Amount"
                          min="0"
                          step={0.1}
                          type="number"
                          placeholder="0"
                        />
                      </Col>
                      <Col xs={6}>
                        <Form.Group className="mb-4" controlId="ApprovalFormDueDate">
                          <Form.Label className="popup-form-labels">Due Date</Form.Label>
                          <Form.Control type="date" defaultValue={new Date().toISOString().substring(0, 10)} />
                        </Form.Group>
                      </Col>
                    </Row>
                  </Col>
                </Row>
                <Row className="gb-4 gx-sm-5 gx-0 justify-content-between">
                  <Col lg={6} md={7}>
                    <Form.Group className="mb-4" controlId="ApprovalFormDescription">
                      <Form.Label className="popup-form-labels">Description</Form.Label>
                      <Form.Control placeholder="Some test here..." as="textarea" rows={5} />
                    </Form.Group>

                    <Form.Group className="mb-4" controlId="ApprovalFormAttachments">
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
                  <Col md className={clsx({ 'border-start': width > 600 })}>
                    <Form.Group className="mb-3">
                      <p className="fw-bold m-0 text-primary">Board Members</p>
                      <p className="small">Select the board members who can approve this request</p>
                    </Form.Group>
                    <Row className="g-0">
                      <Col xl={4} lg={6} md={12} sm={6} xs={12}>
                        <CustomSelect
                          name="board_member"
                          labelText="Choose"
                          controlId="ApprovalFormBoardMember"
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
                    <Row className="g-0">
                      <Col xl={4} lg={6} md={12} sm={6} xs={12}>
                        <CustomSelect
                          name="voting_schema"
                          labelText="Voting Scheme"
                          controlId="ApprovalFormVoting"
                          options={[{ label: 'Unanimus', value: 'Unanimus' }]}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-4',
                          }}
                        />
                      </Col>
                    </Row>
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
                  Save & Send
                </Button>
              </Stack>
            </Card.Footer>
          </Card>
        </Form>
      </div>
    </PageContainer>
  );
};

export default ApprovalCRUD;
