import { Button, Col, Row } from 'react-bootstrap';

import { Popup } from 'components/popup';

import { DownloadIcon } from 'core-ui/icons';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

const PreviewLetter = () => {
  return (
    <Popup title={'Preview Letter'} subtitle={'Add letter information over here'} openForPreview>
      <Row className="gy-2 gx-sm-4 gx-0">
        <Col lg={6} md={5} sm={4}>
          <RenderInformation title="Recipient" description="John Doe" />
        </Col>
        <Col sm={'auto'} xs={12}>
          <RenderInformation title="Date" description="12/05/2022" />
        </Col>
        <Col lg={4} sm xs={12}>
          <div className="ms-md-3 ms-sm-4">
            <RenderInformation title="Sender name" description="Mr. John Doe" />
          </div>
        </Col>
        <Col xs={12}>
          <RenderInformation
            title="Description"
            description="A violation has been updated at Association name in unit, Owned by Owner name"
          />
        </Col>
        <Col xs={'auto'}>
          <RenderInformation title="Stage" description="2nd Notice" />
        </Col>
        <Col xs={'auto'}>
          <div className="ms-md-3 ms-4">
            <RenderInformation title="Deadline" description="12/05/2022" />
          </div>
        </Col>
      </Row>

      <Row className="gx-0 justify-content-sm-end justify-content-center">
        <Col xs={'auto'}>
          <Button variant="light border-primary" onClick={() => SwalExtended.close()} className="px-4 py-1 me-3">
            Cancel
          </Button>
        </Col>
        <Col xs={'auto'}>
          <Button variant="primary" className="d-inline-flex align-items-center px-4 py-1">
            <DownloadIcon size="18" /> <span className="ms-1">Download</span>
          </Button>
        </Col>
      </Row>
    </Popup>
  );
};

export default PreviewLetter;
