import { Card, Col, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useCreateGeneralTagMutation, useGetListOfGeneralTagsQuery } from 'services/api/system-preferences';
import { useUpdateUnitsInformationMutation } from 'services/api/units';

import { InformationSkeleton, InlineSkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { InfoIcon } from 'core-ui/icons';
import { UnitInformationModal } from 'core-ui/popups/unit-information';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';

import { ISingleUnit } from 'interfaces/IUnits';

interface IProps {
  data: ISingleUnit;
}

const UnitInformation = ({ data }: IProps) => {
  const { property: property_id } = useParams();

  const tags = useGetListOfGeneralTagsQuery(data && data.tags ? data.tags : skipToken);

  const [
    updateUnitInformation,
    { isSuccess: isUpdateUnitInfoSuccess, isError: isUpdateUnitInfoError, error: updateUnitInfoError },
  ] = useUpdateUnitsInformationMutation();

  useResponse({
    isSuccess: isUpdateUnitInfoSuccess,
    successTitle: 'Unit Information has been successfully updated!',
    isError: isUpdateUnitInfoError,
    error: updateUnitInfoError,
  });

  const [createGeneralTag, { isError: isCreateGeneralTagError, error: createGeneralTagError }] =
    useCreateGeneralTagMutation();

  useResponse({
    isError: isCreateGeneralTagError,
    error: createGeneralTagError,
  });

  return (
    <Card className="min-h-100">
      <Card.Header className="border-0 py-3 bg-transparent text-start">
        <p className="fw-bold m-0 text-primary">Unit Information</p>
        <EditBtn
          className="position-absolute top-0 end-0 m-2"
          permission={PERMISSIONS.PROPERTY}
          onClick={() => {
            SweetAlert({
              size: 'xl',
              html: (
                <UnitInformationModal
                  data={data}
                  property={property_id}
                  updateUnitInformation={updateUnitInformation}
                  createTag={createGeneralTag}
                />
              ),
            }).fire({
              allowOutsideClick: () => !SwalExtended.isLoading(),
            });
          }}
        />
      </Card.Header>
      <Card.Body className="text-start">
        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Ready for showing on" date={data.ready_for_show_on} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation
              title="Virtual showing available"
              description={data.virtual_showing_available ? 'Yes' : 'No'}
            />
          </Col>
        </Row>

        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Utility bills (Rubs)" description={data.utility_bills ? 'Enabled' : 'Disabled'} />
          </Col>
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Enabled on" date={`${data.utility_bills_date}`} />
          </Col>

          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Lock box" description={data.lock_box} />
          </Col>
        </Row>

        <RenderInformation title="Description" description={data.description} />

        <Row className="gx-0">
          <Col lg={6} md={12} sm={6}>
            <RenderInformation title="Non revenue unit" description={data.non_revenues_status ? 'Yes' : 'No'} />
          </Col>
        </Row>
      </Card.Body>
      <Card.Footer className="border-0 bg-transparent">
        <ApiResponseWrapper
          {...tags}
          hideIfNoResults
          showError={false}
          loadingComponent={
            <InformationSkeleton skeletonType="column" title={false} columnCount={4} xs={'auto'}>
              <InlineSkeleton bg="placeholder" className="px-5 py-2 d-inline-block" />
            </InformationSkeleton>
          }
          renderResults={tags => {
            return (
              <div className="mb-4">
                <Stack direction="horizontal" gap={1}>
                  {tags
                    .filter(d => d.id)
                    .map(item => (
                      <span key={item.id} className="mb-3 py-2 px-3 fw-medium badge rounded-pill bg-dark me-1">
                        {item.name}
                      </span>
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
      </Card.Footer>
    </Card>
  );
};

export default UnitInformation;
