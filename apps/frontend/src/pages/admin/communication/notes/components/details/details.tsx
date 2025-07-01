import { useCallback } from 'react';
import { Badge, Card, Col, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';

import { getSignedURL } from 'api/core';
import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useDeleteNoteMutation, useGetNoteAttachmentsQuery, useGetNoteByIdQuery } from 'services/api/notes';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetListOfGeneralTagsQuery } from 'services/api/system-preferences';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import { ItemName } from 'components/custom-cell';
import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import Skeleton, { InformationSkeleton, InlineSkeleton, SkeletonInlineProperty } from 'components/skeleton';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { InfoIcon } from 'core-ui/icons';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

const Details = () => {
  const { note: note_id } = useParams();
  const { redirect } = useRedirect();

  const note = useGetNoteByIdQuery(getValidID(note_id));
  const property = useGetPropertyByIdQuery(getIDFromObject('associated_property', note.data));
  const attachments = useGetNoteAttachmentsQuery(getValidID(note_id));

  const [deleteNote, { isSuccess: isDeleteNoteSuccess, isError: isDeleteNoteError, error: deleteNoteError }] =
    useDeleteNoteMutation();

  useResponse({
    isSuccess: isDeleteNoteSuccess,
    successTitle: 'Note has been deleted successfully!',
    isError: isDeleteNoteError,
    error: deleteNoteError,
  });

  const tags = useGetListOfGeneralTagsQuery(note && note.data && note.data.tags ? note.data.tags : skipToken);

  const handleDelete = () => {
    if (note_id && Number(note_id) > 0) {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this record?',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          deleteNote(note_id)
            .then(result => {
              if (result.data) {
                redirect(`/notes`, true, 'notes');
              }
            })
            .finally(() => {
              SwalExtended.close();
            });
        }
      });
    }
  };

  const handleAttachmentClick = useCallback((file: string, noteId: number) => {
    if (file && noteId) {
      getSignedURL(file).then(response => {
        if (response.data && response.data.url) {
          window.open(response.data.url, '_blank');
        }
      });
    }
  }, []);

  return (
    <ApiResponseWrapper
      {...note}
      renderResults={data => {
        return (
          <PageContainer>
            <div>
              <Stack direction="horizontal" className="justify-content-between">
                <div>
                  <BackButton />
                  <h1 className="fw-bold h4 mt-1 mb-3">View Notes</h1>
                </div>

                <div>
                  <DeleteBtn permission={PERMISSIONS.COMMUNICATION} showText className="me-3" onClick={handleDelete} />
                  <EditBtn
                    permission={PERMISSIONS.COMMUNICATION}
                    onClick={() => redirect(`/notes/modify/${note_id}`, false, 'notes')}
                  />
                </div>
              </Stack>
            </div>

            <Card className="border-0 p-0 page-section mb-3">
              <Card.Body className="p-4">
                <Row>
                  <Col xl={6} md={8} xs={12}>
                    <p className="fw-bold mb-1 text-primary">{data.title}</p>
                    <ApiResponseWrapper
                      {...tags}
                      hideIfNoResults
                      showError={false}
                      loadingComponent={
                        <InformationSkeleton skeletonType="column" title={false} columnCount={4} xs={'auto'}>
                          <InlineSkeleton bg="placeholder" className="px-5 py-2 d-inline-block" as={Badge} pill />
                        </InformationSkeleton>
                      }
                      renderResults={tags => {
                        return (
                          <div className="mb-4">
                            <Stack direction="horizontal" gap={1}>
                              {tags
                                .filter(d => d.id)
                                .map(item => (
                                  <Badge
                                    pill
                                    key={item.id}
                                    bg="transparent"
                                    className="border border-primary border-opacity-50 text-muted border-1"
                                  >
                                    {item.name}
                                  </Badge>
                                ))}
                              {data.tags && tags.length !== data.tags.length && (
                                <OverlayTrigger
                                  overlay={tooltipProps => (
                                    <Tooltip
                                      {...tooltipProps}
                                      arrowProps={{ style: { display: 'none' } }}
                                      id={`tags-not-found-tooltip`}
                                    >
                                      Some tags were skipped because no record was found with given ID
                                    </Tooltip>
                                  )}
                                >
                                  <span className="text-danger">
                                    <InfoIcon size="10px" />
                                  </span>
                                </OverlayTrigger>
                              )}
                            </Stack>
                          </div>
                        );
                      }}
                    />

                    <RenderInformation containerClass="mt-3" title="Description" description={data.description} />

                    <ApiResponseWrapper
                      {...property}
                      showError={false}
                      loadingComponent={<SkeletonInlineProperty aspect={false} style={{ width: 50, height: 50 }} />}
                      renderResults={data => {
                        const p_type = data.property_type_name;

                        return (
                          <div className="mb-4">
                            <p className="fw-medium text-primary">Associated to</p>
                            {property && (
                              <ItemName
                                value={{
                                  subtitle: p_type,
                                  title: data.name,
                                  image: data.cover_picture,
                                }}
                                preview
                                isThisFor="page"
                              />
                            )}
                          </div>
                        );
                      }}
                    />
                    <ApiResponseWrapper
                      {...attachments}
                      showError={false}
                      hideIfNoResults
                      loadingComponent={
                        <InformationSkeleton xxl={5} lg={8} md={7} columnCount={4} skeletonType="column">
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
                          <Row className="g-3">
                            {data.length > 0 && (
                              <Col xs={12}>
                                <p className="fw-medium mb-0 text-primary">Attachments</p>
                              </Col>
                            )}
                            {data.map((file, indx) => (
                              <Col key={indx} lg={5} sm={6}>
                                <FilePreview
                                  name={file.name}
                                  fileType={file.file_type.toLowerCase()}
                                  onClick={() => handleAttachmentClick(file.file, Number(note_id))}
                                  bg="secondary"
                                />
                              </Col>
                            ))}
                          </Row>
                        );
                      }}
                    />
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </PageContainer>
        );
      }}
    />
  );
};

export default Details;
