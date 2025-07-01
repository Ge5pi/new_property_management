import { useCallback, useState } from 'react';
import { Accordion, Card, Col, ListGroup, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';

import { getSignedURL } from 'api/core';
import { ApiResponseWrapper } from 'components/api-response-wrapper';
import {
  useDeleteAnnouncementMutation,
  useGetAnnouncementAttachmentsQuery,
  useGetAnnouncementByIdQuery,
  useGetUnitsForSelectedPropertyAnnouncementQuery,
} from 'services/api/announcement';
import useResponse from 'services/api/hooks/useResponse';
import { useGetListOfPropertiesQuery } from 'services/api/properties';
import { useGetListOfUnitsQuery } from 'services/api/units';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import { ItemName } from 'components/custom-cell';
import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import Skeleton, { InformationSkeleton, InlineSkeleton, SkeletonInlineProperty } from 'components/skeleton';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { HtmlDisplay, RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { displayDate, getValidID } from 'utils/functions';

const Details = () => {
  const { announcement: announcement_id } = useParams();
  const { redirect } = useRedirect();

  const announcement = useGetAnnouncementByIdQuery(getValidID(announcement_id));
  const attachments = useGetAnnouncementAttachmentsQuery(getValidID(announcement_id));
  const [
    deleteAnnouncement,
    { isSuccess: isDeleteAnnouncementSuccess, isError: isDeleteAnnouncementError, error: deleteAnnouncementError },
  ] = useDeleteAnnouncementMutation();

  useResponse({
    isSuccess: isDeleteAnnouncementSuccess,
    successTitle: 'Announcement has been deleted successfully!',
    isError: isDeleteAnnouncementError,
    error: deleteAnnouncementError,
  });

  const handleDelete = () => {
    if (announcement_id && Number(announcement_id) > 0) {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this record?',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          deleteAnnouncement(announcement_id)
            .then(result => {
              if (result.data) {
                redirect(`/announcements`, true, 'announcements');
              }
            })
            .finally(() => {
              SwalExtended.close();
            });
        }
      });
    }
  };

  const handleAttachmentClick = useCallback((file: string, announcementID: number) => {
    if (file && announcementID) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  const selectionsUnit = ['APSU', 'SPSU'];
  const selectionsProperty = ['SPAU', 'SPSU'];
  const fetchUnitsIf =
    announcement.data && announcement.data.selection && selectionsUnit.includes(announcement.data.selection);
  const fetchPropertiesIf =
    announcement.data && announcement.data.selection && selectionsProperty.includes(announcement.data.selection);

  const units_data = useGetListOfUnitsQuery(
    announcement.data && announcement.data.units && announcement.data.units.length > 0 && fetchUnitsIf
      ? (announcement.data.units as number[])
      : skipToken
  );

  const properties_data = useGetListOfPropertiesQuery(
    announcement.data && announcement.data.properties && announcement.data.properties.length > 0 && fetchPropertiesIf
      ? (announcement.data.properties as number[])
      : skipToken
  );

  const [toggledState, setToggledState] = useState<{ [key: string | number]: boolean }>();

  return (
    <ApiResponseWrapper
      {...announcement}
      renderResults={data => (
        <PageContainer>
          <div>
            <Stack direction="horizontal" className="justify-content-between">
              <div>
                <BackButton />
                <h1 className="fw-bold h4 mt-1 mb-3">Announcement Details</h1>
              </div>

              <div>
                <DeleteBtn permission={PERMISSIONS.COMMUNICATION} showText className="me-3" onClick={handleDelete} />
                <EditBtn
                  permission={PERMISSIONS.COMMUNICATION}
                  onClick={() => redirect(`/announcements/modify/${announcement_id}`, false, 'announcements')}
                />
              </div>
            </Stack>
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
                {data.send_by_email && <RenderInformation title="Displayed on" description="Sent on emails" />}
                {data.display_on_tenant_portal && (
                  <RenderInformation
                    title={!data.send_by_email ? 'Displayed on' : ''}
                    description="Displayed on tenant portals"
                  />
                )}
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
              <Row className="gx-0 mt-4">
                {data.selection === 'APAU' && (
                  <Col xs={12}>
                    <RenderInformation
                      title="Selected Properties & Units"
                      desClass="d-flex align-items-center gap-2 flex-wrap"
                      description="Shared with all properties and all units"
                    />
                  </Col>
                )}
                {data.selection === 'APSU' && (
                  <Col xs={12}>
                    <RenderInformation
                      title="Selected Properties & Units"
                      desClass="d-flex align-items-center gap-2 flex-wrap"
                      description="Shared with all properties and following units"
                    />
                    <ApiResponseWrapper
                      {...units_data}
                      showError={false}
                      loadingComponent={<AccordionLoading />}
                      renderResults={data => {
                        return (
                          <Row className="gx-0">
                            <Col md={6} className="border">
                              <ListGroup className="p-4" variant="flush">
                                <p className="pb-2 m-0 fw-bold">Selected Units ({data.length})</p>
                                {data.map(u => (
                                  <ListGroup.Item key={`${u.id}`}>
                                    <ItemName
                                      value={{
                                        title: u.name,
                                        subtitle: u.unit_type_name,
                                        image: u.cover_picture ? u.cover_picture : '',
                                      }}
                                      preview
                                      isThisFor="page"
                                    />
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </Col>
                          </Row>
                        );
                      }}
                    />
                  </Col>
                )}
                {data.selection === 'SPAU' && (
                  <Col xs={12}>
                    <RenderInformation
                      title="Selected Properties & Units"
                      description="Shared with all units for following selected properties"
                    />
                    <ApiResponseWrapper
                      {...properties_data}
                      showError={false}
                      loadingComponent={<AccordionLoading hideHeaderLoading />}
                      renderResults={data => {
                        return (
                          <Row className="gx-0">
                            <Col md={6} className="border">
                              <ListGroup className="p-4" variant="flush">
                                <p className="pb-2 m-0 fw-bold">Selected Properties ({data.length})</p>
                                {data.map(p => (
                                  <ListGroup.Item key={`${p.id}`}>
                                    <ItemName
                                      value={{
                                        title: p.name,
                                        subtitle: p.property_type_name,
                                        image: p.cover_picture,
                                      }}
                                      preview
                                      isThisFor="page"
                                    />
                                  </ListGroup.Item>
                                ))}
                              </ListGroup>
                            </Col>
                          </Row>
                        );
                      }}
                    />
                  </Col>
                )}
                {data.selection === 'SPSU' && (
                  <Col xs={12}>
                    <RenderInformation
                      title="Selected Properties & Units"
                      description="Shared with following properties and their units"
                    />
                    <ApiResponseWrapper
                      {...properties_data}
                      showError={false}
                      loadingComponent={<AccordionLoading hideItemLoading />}
                      renderResults={data => {
                        return (
                          <Row className="gx-0">
                            <Col md={6} className="border">
                              <Accordion flush>
                                {data.map(p => (
                                  <Accordion.Item eventKey={`${p.id}`} key={p.id}>
                                    <Accordion.Header>
                                      <ItemName
                                        isThisFor="page"
                                        value={{
                                          title: p.name,
                                          subtitle: p.property_type_name,
                                        }}
                                      />
                                    </Accordion.Header>
                                    <Accordion.Body onEntered={() => setToggledState({ [`${p.id}`]: true })}>
                                      {(!toggledState || (toggledState && Boolean(!toggledState[`${p.id}`]))) && (
                                        <AccordionLoading />
                                      )}
                                      {toggledState &&
                                        toggledState[`${p.id}`] &&
                                        (p.id && announcement_id ? (
                                          <RenderUnitsForSelectedProperty
                                            property={Number(p.id)}
                                            announcement={Number(announcement_id)}
                                          />
                                        ) : (
                                          <p className="text-danger">
                                            Invalid Property ID found. Unable to fetch units
                                          </p>
                                        ))}
                                    </Accordion.Body>
                                  </Accordion.Item>
                                ))}
                              </Accordion>
                            </Col>
                          </Row>
                        );
                      }}
                    />
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </PageContainer>
      )}
    />
  );
};

interface IRenderUPProps {
  property: number;
  announcement: number;
}
const RenderUnitsForSelectedProperty = ({ property, announcement }: IRenderUPProps) => {
  const units_for_property = useGetUnitsForSelectedPropertyAnnouncementQuery({
    announcement_id: announcement,
    property_id: property,
  });
  return (
    <ApiResponseWrapper
      {...units_for_property}
      showError={false}
      loadingComponent={<AccordionLoading />}
      renderResults={data => {
        return (
          <ListGroup variant="flush">
            {data.length === 0 && (
              <ListGroup.Item className="p-2">
                <RenderInformation
                  title={`Selected Units (all)`}
                  description="This announcement is shared with all units of current property as you didn't selected any specific unit for current property"
                />
              </ListGroup.Item>
            )}
            {data.length > 0 && (
              <div>
                <p className="pb-2 m-0 fw-bold">Selected Units ({data.length})</p>
                {data.map(u => (
                  <ListGroup.Item className="p-2 mb-2 border" key={`${u.id}`}>
                    <ItemName
                      value={{
                        title: u.name,
                        subtitle: u.unit_type_name,
                        image: u.cover_picture ? u.cover_picture : '',
                      }}
                      preview
                      isThisFor="page"
                    />
                  </ListGroup.Item>
                ))}
              </div>
            )}
          </ListGroup>
        );
      }}
    />
  );
};

interface IAccordionLoadingProps {
  hideItemLoading?: boolean;
  hideHeaderLoading?: boolean;
}
const AccordionLoading = ({ hideItemLoading, hideHeaderLoading }: IAccordionLoadingProps) => {
  return (
    <Row className="gx-0">
      <Col lg={4} md={6}>
        {!hideHeaderLoading && <InformationSkeleton lines="single" />}
        {!hideItemLoading && <SkeletonInlineProperty aspect={false} style={{ width: 50, height: 50 }} />}
      </Col>
    </Row>
  );
};

export default Details;
