import { useCallback, useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { Popup } from 'components/popup';

import { FILE_TYPES_DOCS_IMAGES } from 'constants/file-types';

import { IFileIDs } from 'interfaces/IAttachments';

const SendEmail = () => {
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
    <Popup title={'Send Email'} subtitle={'Add email information here'}>
      <Row className="gy-md-0 gy-4 gx-md-4 gx-sm-1 gx-0">
        <Col xs={12}>
          <Form.Group className="mb-4" controlId="SendEmailFormRecipient">
            <Form.Label className="popup-form-labels">Recipient</Form.Label>
            <Form.Control autoFocus type="text" placeholder="Search Recipient" />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Form.Group className="mb-4" controlId="SendEmailFormBody">
            <Form.Label className="popup-form-labels">Email Body</Form.Label>
            <Form.Control placeholder="Enter some text here" as="textarea" rows={5} />
          </Form.Group>
        </Col>
        <Col xs={12}>
          <Dropzone onDrop={onDrop} accept={FILE_TYPES_DOCS_IMAGES} />
        </Col>
      </Row>
      {files.length > 0 && (
        <Row className="gx-0 align-items-stretch justify-content-end">
          {files.map((file, indx) => (
            <Col key={indx} lg={4} md={6}>
              <FileAttachments file={file.file} />
            </Col>
          ))}
        </Row>
      )}
    </Popup>
  );
};

export default SendEmail;
