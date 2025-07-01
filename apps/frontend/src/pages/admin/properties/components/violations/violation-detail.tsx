import { Button, Card, Col, Row } from 'react-bootstrap';

import { FilePreview } from 'components/file-attachments';
import { Log } from 'components/log';
import PageContainer from 'components/page-container';

import { DollarIcon, ReportIcon, SendIcon, TrashIcon } from 'core-ui/icons';
import { SendEmail } from 'core-ui/popups/violations';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useWindowSize } from 'hooks/useWindowSize';

import PropertyImage from 'assets/images/login-background.jpg';

const ViolationDetail = () => {
  const [width] = useWindowSize();

  const handleSendEmail = () => {
    SweetAlert({
      size: 'lg',
      html: <SendEmail />,
    }).fire({
      allowOutsideClick: () => !SwalExtended.isLoading(),
    });
  };

  return (
    <PageContainer>
      <div className="container-fluid page-section pt-4 pb-3">
        <Card className="border-0">
          <Row className="gx-3 gb-4 justify-content-between align-items-start">
            <Col xs={12}>
              <Card.Header className="border-0 bg-transparent text-start">
                <p className="fw-bold m-0 text-primary fw-bold">ID-12322</p>
                <p className="small mb-1">Violation Details</p>
              </Card.Header>
            </Col>
            <Col xl={6} md={8} className="order-2 order-md-1">
              <Card.Body className="text-start pt-4">
                <Row className="justify-content-lg-evenly gy-0 gx-sm-4 gx-0">
                  <Col lg={4} sm={6}>
                    <div className="me-1">
                      <RenderInformation title="Violation date" description="12/05/2022" />
                    </div>
                  </Col>
                  <Col lg={4} sm={6}>
                    <div className="ms-sm-1">
                      <RenderInformation title="Violation Type" description="High grass" />
                    </div>
                  </Col>
                  <Col lg={4} sm={6}>
                    <div className="ms-sm-1">
                      <RenderInformation title="Violation Category" description="Exterior" />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Body className="text-start py-0">
                <RenderInformation title="Home owner" description={`Demo home owner John Doe`} />
              </Card.Body>
              <Card.Body className="text-start py-0">
                <RenderInformation title="Association" description={`Demo Association Title`} />
              </Card.Body>
              <Card.Body className="text-start py-0">
                <Row className="justify-content-between gy-0 gx-sm-4 gx-0">
                  <Col sm={8}>
                    <div className="me-1">
                      <RenderInformation
                        title="Description"
                        description="Description text over here Lorem ipsum dolor sit amet, consectetur adipiscing elit. Viverra sed eu viverra ac feugiat aenean pharetra, semper. Pulvinar pellentesque."
                      />
                    </div>
                  </Col>
                  <Col sm>
                    <div className="ms-sm-1">
                      <RenderInformation title="Required action" description="Demo action" />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Body className="text-start py-0">
                <Row className="gy-0 gx-sm-4 gx-0">
                  <Col sm={4}>
                    <div className="me-1">
                      <RenderInformation title="Stage" description="1st Notice" />
                    </div>
                  </Col>
                  <Col sm={4}>
                    <div className="ms-sm-1">
                      <RenderInformation title="Deadline" description="Demo action" />
                    </div>
                  </Col>
                </Row>
              </Card.Body>
              <Card.Body className="text-start py-0">
                <Row className="justify-content-sm-start justify-content-between gy-sm-0 gy-3 gx-sm-4 gx-2">
                  <Col xxl={width > 1440 ? 5 : 6} lg={6} sm={6} xs={12}>
                    <FilePreview name={'IMG2123123'} fileType="JPG" size={2670} preview={PropertyImage} />
                  </Col>
                  <Col xxl={width > 1440 ? 5 : 6} lg={6} sm={6} xs={12}>
                    <FilePreview name={'IMG2123123'} fileType="JPG" size={2670} preview={PropertyImage} />
                  </Col>
                </Row>
              </Card.Body>
            </Col>
            <Col lg={3} md={4} className="order-1 order-md-2">
              <Card.Body className="text-start pt-md-3 pt-4 pb-0 ms-xxl-5">
                <h4 className="h6 text-primary mb-1 fw-medium text-capitalize">Actions</h4>
                <Row className="justify-content-md-end justify-content-between gy-3 gx-md-5 gx-2">
                  <Col md={12} sm={6}>
                    <Button className="d-inline-flex align-items-center w-100 py-2 text-start" variant="primary">
                      <ReportIcon /> <span className="ms-1">Generate Letter</span>
                    </Button>
                  </Col>
                  <Col md={12} sm={6}>
                    <Button
                      className="d-inline-flex align-items-center w-100 py-2 text-start"
                      variant="primary"
                      onClick={handleSendEmail}
                    >
                      <SendIcon /> <span className="ms-1">Email Owner</span>
                    </Button>
                  </Col>
                  <Col md={12} sm={6}>
                    <Button className="d-inline-flex align-items-center w-100 py-2 text-start" variant="primary">
                      <DollarIcon /> <span className="ms-1">Enter Fee</span>
                    </Button>
                  </Col>
                  <Col md={12} sm={6}>
                    <Button className="d-inline-flex align-items-center w-100 py-2 text-start" variant="primary">
                      <TrashIcon size="24" /> <span className="ms-1">Delete Violation</span>
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>

      <div className="container-fluid page-section my-4">
        <Row className="mt-1 gx-3 align-items-stretch">
          <Col xs={12}>
            <Card className="border-0">
              <Card.Header className="border-0 py-3 bg-transparent text-start">
                <Card.Title className="fw-bold text-primary">History</Card.Title>
              </Card.Header>
              <Card.Body className="card-body-custom-padding text-start pt-0">
                <Log
                  logs={[
                    {
                      text: 'Shared to violation owner via email',
                      created_at: '12/05/2022',
                    },
                    {
                      text: 'Shared to violation owner via email',
                      created_at: '12/05/2022',
                    },
                  ]}
                />
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </div>
    </PageContainer>
  );
};

export default ViolationDetail;
