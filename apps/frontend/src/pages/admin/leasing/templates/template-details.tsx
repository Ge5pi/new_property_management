import { useState } from 'react';
import { Card, Col, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useDeleteRentalTemplateMutation,
  useGetRentalTemplateByIdQuery,
  useUpdateRentalTemplateMutation,
} from 'services/api/rental-templates';

import { Confirmation, PleaseWait } from 'components/alerts';
import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';

import { DeleteBtn } from 'core-ui/delete-btn';
import { EditBtn } from 'core-ui/edit-button';
import { NewApplicationTemplateModal } from 'core-ui/popups/new-template';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { rentalApplicationSteps } from 'constants/steps';
import { getValidID } from 'utils/functions';

import { IRentalTemplate } from 'interfaces/IApplications';

import { ApplicationSteps } from './components/application-steps';

const TemplateDetails = () => {
  const { template: template_id } = useParams();
  const template = useGetRentalTemplateByIdQuery(getValidID(template_id));

  const { redirect } = useRedirect();

  const [
    updateTemplate,
    { isSuccess: isUpdateTemplateSuccess, isError: isUpdateTemplateError, error: updateTemplateError },
  ] = useUpdateRentalTemplateMutation();

  useResponse({
    isSuccess: isUpdateTemplateSuccess,
    successTitle: 'Template Information has been updated successfully',
    isError: isUpdateTemplateError,
    error: updateTemplateError,
  });

  const [
    deleteRentalTemplateByID,
    {
      isSuccess: isDeleteRentalTemplateSuccess,
      isError: isDeleteRentalTemplateError,
      error: deleteRentalTemplateError,
    },
  ] = useDeleteRentalTemplateMutation();

  useResponse({
    isSuccess: isDeleteRentalTemplateSuccess,
    successTitle: 'You have deleted template',
    isError: isDeleteRentalTemplateError,
    error: deleteRentalTemplateError,
  });

  const [disabled, setDisabled] = useState(false);
  const deleteRecord = (id: string | number) => {
    Confirmation({
      title: 'Delete',
      type: 'danger',
      description: 'Are you sure you want to delete this record?',
    }).then(result => {
      if (result.isConfirmed) {
        PleaseWait();
        setDisabled(true);
        deleteRentalTemplateByID(id)
          .then(result => {
            if (result.data) {
              redirect(`/templates`, true, 'templates');
            }
          })
          .finally(() => {
            SwalExtended.close();
            setDisabled(false);
          });
      }
    });
  };

  return (
    <ApiResponseWrapper
      {...template}
      renderResults={data => {
        const steps = Object.keys(data).flatMap(k =>
          rentalApplicationSteps.filter(r => r.name === k && data[k as keyof IRentalTemplate])
        );

        return (
          <PageContainer>
            <div className="my-3">
              <Row className="align-items-end">
                <Col>
                  <div>
                    <BackButton />
                    <h1 className="fw-bold h4 mt-1"> Application Form </h1>
                  </div>
                </Col>
                <Col sm={'auto'}>
                  <div className="my-3">
                    <Stack gap={3} className="justify-content-end" direction="horizontal">
                      <DeleteBtn
                        showText
                        permission={PERMISSIONS.LEASING}
                        disabled={disabled}
                        onClick={() => data.id && deleteRecord(data.id)}
                      />
                      <EditBtn
                        permission={PERMISSIONS.LEASING}
                        onClick={() => {
                          SweetAlert({
                            size: 'lg',
                            html: (
                              <NewApplicationTemplateModal
                                update={true}
                                template={data}
                                updateTemplate={updateTemplate}
                              />
                            ),
                          }).fire({
                            allowOutsideClick: () => !SwalExtended.isLoading(),
                          });
                        }}
                      />
                    </Stack>
                  </div>
                </Col>
              </Row>

              <Card className="border-0 p-4 page-section my-3">
                <Card.Header className="border-0 p-0 bg-transparent text-start">
                  <div>
                    <p className="fw-bold m-0 text-primary">{data.name}</p>
                    <p className="small">{data.description}</p>
                  </div>
                </Card.Header>
                <ApplicationSteps applicationSteps={steps} />
              </Card>
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default TemplateDetails;
