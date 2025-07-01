import { useCallback } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { getSignedURL } from 'api/core';
import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetAnnouncementAttachmentsQuery } from 'services/api/announcement';
import { useGetTenantsAnnouncementByIdQuery } from 'services/api/tenants/announcements';

import { BackButton } from 'components/back-button';
import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import Skeleton, { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { HtmlDisplay, RenderInformation } from 'core-ui/render-information';

import { displayDate, getValidID } from 'utils/functions';

const Details = () => {
  const { announcement: announcement_id } = useParams();

  const announcement = useGetTenantsAnnouncementByIdQuery(getValidID(announcement_id));
  const attachments = useGetAnnouncementAttachmentsQuery(getValidID(announcement_id));

  const handleAttachmentClick = useCallback((file: string, announcementID: number) => {
    if (file && announcementID) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  return (
    <ApiResponseWrapper
      {...announcement}
      renderResults={data => (
        <PageContainer>
          <div>
            <BackButton />
            <h1 className="fw-bold h4 mt-1 mb-3">Announcement Details</h1>
          </div>

          <Card className="border-0 p-0 page-section mb-3">
            <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
              <Stack direction="horizontal" className="justify-content-between">
                <p className="fw-bold m-0 text-primary">{data.title}</p>
                <h6 className="small m-0 fw-medium">{displayDate(data.created_at)}</h6>
              </Stack>
            </Card.Header>

            <Card.Body className="p-4">
              <HtmlDisplay title="Body" value={data.body} />
              <Stack direction="horizontal" gap={5} className="flex-wrap align-items-start">
                <RenderInformation title="Display date" date={data.display_date} />
                <RenderInformation title="Expiry date" date={data.expiry_date} />
              </Stack>
              <ApiResponseWrapper
                {...attachments}
                showError={false}
                hideIfNoResults
                loadingComponent={
                  <InformationSkeleton xxl={3} lg={5} md={6} columnCount={4} skeletonType="column">
                    <Card className="border-0 bg-light shadow-sm">
                      <Card.Body>
                        <Skeleton style={{ width: 25, height: 25 }} />
                        <InlineSkeleton xs={8} />
                      </Card.Body>
                    </Card>
                  </InformationSkeleton>
                }
                renderResults={data => {
                  return (
                    <Row className="gy-3 gx-1">
                      {data.length > 0 && (
                        <Col xs={12}>
                          <p className="fw-medium mb-0 text-primary">Attachments</p>
                        </Col>
                      )}
                      {data.map((file, indx) => (
                        <Col key={indx} xxl={3} lg={5} md={6}>
                          <FilePreview
                            name={file.name}
                            fileType={file.file_type.toLowerCase()}
                            onClick={() => handleAttachmentClick(file.file, Number(announcement_id))}
                            bg="secondary"
                          />
                        </Col>
                      ))}
                    </Row>
                  );
                }}
              />
            </Card.Body>
          </Card>
        </PageContainer>
      )}
    />
  );
};

export default Details;
