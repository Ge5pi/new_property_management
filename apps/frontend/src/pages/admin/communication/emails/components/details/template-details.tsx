import { Fragment } from 'react';
import { Card, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetEmailSignatureByIdQuery } from 'services/api/email-signature';
import { useDeleteEmailTemplateMutation, useGetEmailTemplateByIdQuery } from 'services/api/email-template';
import useResponse from 'services/api/hooks/useResponse';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { InformationSkeleton } from 'components/skeleton';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { HtmlDisplay, RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

const TemplateDetails = () => {
  const { redirect } = useRedirect();
  const { template: template_id } = useParams();

  const template = useGetEmailTemplateByIdQuery(getValidID(template_id));
  const signature = useGetEmailSignatureByIdQuery(getIDFromObject('signature', template.data));

  const [
    deleteTemplate,
    { isSuccess: isDeleteTemplateSuccess, isError: isDeleteTemplateError, error: deleteTemplateError },
  ] = useDeleteEmailTemplateMutation();

  useResponse({
    isSuccess: isDeleteTemplateSuccess,
    successTitle: 'Template has been deleted successfully!',
    isError: isDeleteTemplateError,
    error: deleteTemplateError,
  });

  const handleDelete = () => {
    if (template_id && Number(template_id) > 0) {
      Confirmation({
        title: 'Delete',
        type: 'danger',
        description: 'Are you sure you want to delete this record?',
      }).then(result => {
        if (result.isConfirmed) {
          PleaseWait();
          deleteTemplate(template_id)
            .then(result => {
              if (result.data) {
                redirect(`/template`, true, 'template');
              }
            })
            .finally(() => {
              SwalExtended.close();
            });
        }
      });
    }
  };

  return (
    <ApiResponseWrapper
      {...template}
      renderResults={data => {
        return (
          <PageContainer>
            <Stack direction="horizontal" className="justify-content-between">
              <div>
                <BackButton />
              </div>

              <div>
                <DeleteBtn permission={PERMISSIONS.COMMUNICATION} showText className="me-3" onClick={handleDelete} />
                <EditBtn
                  permission={PERMISSIONS.COMMUNICATION}
                  onClick={() => redirect(`/template/modify/${template_id}`, false, 'template')}
                />
              </div>
            </Stack>
            <Card className="mt-3 border-0 p-0 page-section mb-3">
              <Card.Header className="border-0 p-4 pb-0 bg-transparent text-start">
                <h1 className="fw-bold h5 m-0">{data.subject}</h1>
              </Card.Header>

              <Card.Body className="p-4 text-start announcements-steps-card">
                <RenderInformation
                  title="Recipients"
                  description={
                    <Fragment>
                      <span className="me-1 text-capitalize fw-bold">{data.recipient_type.toLowerCase()}</span>
                      {data.recipient_type === 'INDIVIDUAL' && data.individual_recipient_type && (
                        <span className="text-capitalize fw-normal">
                          ({data.individual_recipient_type.toLowerCase()})
                        </span>
                      )}
                    </Fragment>
                  }
                />

                <HtmlDisplay title="Body" value={data.body} />
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

export default TemplateDetails;
