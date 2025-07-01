import { Card, Col, Row, Stack } from 'react-bootstrap';

import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';

import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';

import { PERMISSIONS } from 'constants/permissions';

const ArchitecturalReviewDetail = () => {
  return (
    <PageContainer>
      <div className="container-fluid page-section pt-4 pb-3">
        <Card className="border-0">
          <Row className="gx-3 gb-4 align-items-center">
            <Col xs={12}>
              <Card.Header className="border-0 bg-transparent text-start">
                <Stack>
                  <p className="fw-bold m-0 text-primary fw-bold">Review ID - 122312</p>
                  <EditBtn permission={PERMISSIONS.PROPERTY} className="position-absolute top-0 end-0 m-2" />
                </Stack>
              </Card.Header>
            </Col>
            <Col xl={6} lg={7}>
              <Card.Body className="text-start pt-4">
                <RenderInformation title="Home owner" description={`Demo home owner John Doe`} />
                <Row className="justify-content-between gy-0 gx-sm-4 gx-0">
                  <Col md={4} sm={6}>
                    <div className="me-1">
                      <RenderInformation title="Association" description="Demo Association Title" />
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="ms-sm-1">
                      <RenderInformation title="Status" description="Rejected" />
                    </div>
                  </Col>
                </Row>
                <Row className="justify-content-between gy-0 gx-sm-4 gx-0">
                  <Col md={4} sm={6}>
                    <div className="me-1">
                      <RenderInformation title="Approved by" description="Mr. John Doe" />
                    </div>
                  </Col>
                  <Col md={4} sm={6}>
                    <div className="ms-sm-1">
                      <RenderInformation title="Approved Date" description="12/05/2022" />
                    </div>
                  </Col>
                </Row>
                <RenderInformation
                  title="Rejected Reason"
                  description="Description text over here Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed eu viverra ac feugiat aenean pharetra, semper. Pulvinar pellentesque."
                />
                <Row className="justify-content-sm-start justify-content-between gy-sm-0 gy-3 gx-sm-4 gx-2">
                  <Col lg={6} md={5} sm={6} xs={12}>
                    <FilePreview name="Attachment" fileType="doc" size={1460} />
                  </Col>
                  <Col lg={6} md={5} sm={6} xs={12}>
                    <FilePreview name="Attachment" fileType="doc" size={8650} />
                  </Col>
                </Row>
              </Card.Body>
            </Col>
            <Col xl={4} lg={5} md={'auto'}>
              <Card.Body className="text-start">
                <RenderInformation
                  title="Architectural Change description"
                  description={`Description text over here Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed eu viverra ac feugiat aenean pharetra, semper. Pulvinar pellentesque.`}
                />
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ArchitecturalReviewDetail;
