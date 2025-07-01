import { Card, Col, Row } from 'react-bootstrap';

import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';

import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';

const ApprovalDetail = () => {
  const { redirect } = useRedirect();

  const handleItemClick = () => {
    redirect('#/edit');
  };

  return (
    <PageContainer>
      <div className="container-fluid page-section pt-5 pb-3">
        <Card className="border-0">
          <Row className="gx-3 gb-4 align-items-center justify-content-between">
            <Col xs={12}>
              <Card.Header className="border-0 bg-transparent text-start">
                <EditBtn
                  permission={PERMISSIONS.PROPERTY}
                  className="position-absolute top-0 end-0 m-2"
                  onClick={handleItemClick}
                />
              </Card.Header>
            </Col>
            <Col xl={6} lg={7}>
              <Card.Body className="text-start">
                <RenderInformation
                  title="Demo approval name here"
                  description={`Lorem ipsum dolor sit amet consectetur adipisicing elit. Hic earum pariatur nulla enim modi porro velit aut atque assumenda, aspernatur nisi iure repudiandae vel ipsa maiores consequuntur ratione facere optio.`}
                />
                <Row className="justify-content-sm-start justify-content-between gy-0 gx-sm-4 gx-2">
                  <Col xs={'auto'}>
                    <div className="me-1">
                      <RenderInformation title="Amount" description="$20.00" />
                    </div>
                  </Col>
                  <Col xs={'auto'}>
                    <div className="ms-1">
                      <RenderInformation title="Due date" description="12/05/2022" />
                    </div>
                  </Col>
                </Row>
                <RenderInformation
                  title="Board Members"
                  description="Select the board members who can approve this request"
                />
                <Row className="justify-content-sm-start justify-content-between gy-0 gx-sm-4 gx-2">
                  <Col xs={'auto'}>
                    <div className="me-1">
                      <RenderInformation title="Member" description="President" />
                    </div>
                  </Col>
                  <Col xs={'auto'}>
                    <div className="ms-1">
                      <RenderInformation title="Voting Scheme" description="Unanimus" />
                    </div>
                  </Col>
                </Row>
                <Row className="justify-content-sm-start justify-content-between gy-sm-0 gy-3 gx-sm-4 gx-2">
                  <Col lg={6} md={5} sm={6} xs={12}>
                    <FilePreview name="Attachment" fileType="doc" size={300} />
                  </Col>
                  <Col lg={6} md={5} sm={6} xs={12}>
                    <FilePreview name="Attachment" fileType="doc" size={300} />
                  </Col>
                </Row>
              </Card.Body>
            </Col>
          </Row>
        </Card>
      </div>
    </PageContainer>
  );
};

export default ApprovalDetail;
