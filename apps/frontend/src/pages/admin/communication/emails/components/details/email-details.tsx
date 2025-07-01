import { Fragment, useCallback } from 'react';
import { Badge, Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { getSignedURL } from 'api/core';
import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetEmailSignatureByIdQuery } from 'services/api/email-signature';
import { useDeleteEmailMutation, useGetEmailByIdQuery } from 'services/api/emails';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import { FilePreview } from 'components/file-attachments';
import PageContainer from 'components/page-container';
import { InformationSkeleton } from 'components/skeleton';

import { DeleteBtn } from 'core-ui/delete-btn';
import { LazyImage } from 'core-ui/lazy-image';
import { HtmlDisplay, RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

const EmailDetails = () => {
  const { redirect } = useRedirect();
  const { email: email_id } = useParams();

  const email = useGetEmailByIdQuery(getValidID(email_id));
  const signature = useGetEmailSignatureByIdQuery(getIDFromObject('signature', email.data));

  const [deleteEmail, { isSuccess: isDeleteEmailSuccess, isError: isDeleteEmailError, error: deleteEmailError }] =
    useDeleteEmailMutation();

  useResponse({
    isSuccess: isDeleteEmailSuccess,
    successTitle: 'Email has been deleted successfully!',
    isError: isDeleteEmailError,
    error: deleteEmailError,
  });

  const handleDelete = () => {
    if (email_id && Number(email_id) > 0) {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this record? This is just a history of the email you sent',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          deleteEmail(email_id)
            .then(result => {
              if (result.data) {
                redirect(`/emails`, true, 'emails');
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
      {...email}
      renderResults={data => {
        return (
          <PageContainer>
            <Stack direction="horizontal" className="justify-content-between">
              <BackButton />
              <DeleteBtn permission={PERMISSIONS.COMMUNICATION} showText className="me-3" onClick={handleDelete} />
            </Stack>
            <Card className="mt-3 border-0 p-0 page-section mb-3">
              <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
                <h1 className="fw-bold h5 m-0">{data.subject}</h1>
              </Card.Header>

              <Card.Body className="p-4 text-start announcements-steps-card">
                {data.created_by && (
                  <RenderInformation
                    title="From"
                    description={
                      <Badge pill bg="light" className="px-4 py-2">
                        <a
                          className="link link-info"
                          href={`mailto:${data.created_by.email}`}
                          rel="noreferrer"
                          target="_blank"
                        >
                          <span className="h6 fw-medium">{`< ${data.created_by.email} >`}</span>
                        </a>
                      </Badge>
                    }
                  />
                )}

                <RenderInformation
                  title="Recipients"
                  html={
                    <Fragment>
                      <span className="me-1 text-capitalize fw-bold">{data.recipient_type.toLowerCase()}</span>
                      {data.recipient_type === 'INDIVIDUAL' && data.individual_recipient_type && (
                        <span className="text-capitalize fw-normal">
                          ({data.individual_recipient_type.toLowerCase()})
                        </span>
                      )}
                      <Row className="gx-3 gy-2">
                        <Col lg={8} md={10} xs>
                          {data.recipient_emails &&
                            data.recipient_emails
                              .filter((i, p, slf) => slf.indexOf(i) === p)
                              .map((re, ix) => (
                                <Badge key={`${re}_${ix}`} pill bg="light" className="px-4 py-2">
                                  <a className="link link-info" href={`mailto:${re}`} rel="noreferrer" target="_blank">
                                    <span className="h6 fw-medium">{`< ${re} >`}</span>
                                  </a>
                                </Badge>
                              ))}
                        </Col>
                      </Row>
                    </Fragment>
                  }
                />

                <HtmlDisplay title="Body" value={data.body} />

                {data.attachments && data.attachments.length > 0 && (
                  <Fragment>
                    <p className="fw-medium text-primary">Attachments</p>
                    <Row className="gy-3 gx-1">
                      {data.attachments.map((file, indx) => (
                        <Col key={indx} xxl={5} lg={8} md={7}>
                          <FilePreview
                            name={file.name}
                            fileType={file.file_type.toLowerCase()}
                            onClick={() => handleAttachmentClick(file.file, Number(email_id))}
                            bg="secondary"
                          />
                        </Col>
                      ))}
                    </Row>
                  </Fragment>
                )}

                {data.signature && (
                  <ApiResponseWrapper
                    {...signature}
                    showError={false}
                    loadingComponent={<InformationSkeleton lines="single" />}
                    renderResults={sig => {
                      return (
                        <Fragment>
                          {sig.text && sig.text !== 'IMAGE' && <HtmlDisplay value={sig.text} title="Signature" />}
                          {sig.image && (
                            <Fragment>
                              <h6 className="mb-1 text-capitalize fw-medium">Signature</h6>
                              <LazyImage preview src={sig.image} size="sm" />
                            </Fragment>
                          )}
                        </Fragment>
                      );
                    }}
                  />
                )}
              </Card.Body>
            </Card>
          </PageContainer>
        );
      }}
    />
  );
};

export default EmailDetails;
