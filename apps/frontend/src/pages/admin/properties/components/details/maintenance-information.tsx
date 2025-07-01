import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetPropertyByIdQuery, useUpdatePropertiesInformationMutation } from 'services/api/properties';

import { InformationSkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { MaintenanceInformationModal } from 'core-ui/popups/maintenance-information';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const MaintenanceInformation = () => {
  const { property: property_id } = useParams();
  // get property by id
  const property = useGetPropertyByIdQuery(getValidID(property_id));

  // update property information
  const [
    updateMaintenanceInformation,
    {
      isSuccess: isUpdateMaintenanceInfoSuccess,
      isError: isUpdateMaintenanceInfoError,
      error: updateMaintenanceInfoError,
    },
  ] = useUpdatePropertiesInformationMutation();
  useResponse({
    isSuccess: isUpdateMaintenanceInfoSuccess,
    successTitle: 'Maintenance Information has been successfully updated!',
    isError: isUpdateMaintenanceInfoError,
    error: updateMaintenanceInfoError,
  });

  return (
    <ApiResponseWrapper
      {...property}
      showMiniError
      loadingComponent={
        <InformationSkeleton skeletonType="column" title={false} columnCount={6} lg={4} sm={6}>
          <InformationSkeleton lines="single" />
        </InformationSkeleton>
      }
      renderResults={data => {
        return (
          <Card className="border-0 page-section">
            <Card.Header className="border-0 py-3 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Maintenance Information</p>
              <EditBtn
                className="position-absolute top-0 end-0 m-2"
                permission={PERMISSIONS.PROPERTY}
                onClick={() => {
                  SweetAlert({
                    size: 'lg',
                    html: (
                      <MaintenanceInformationModal
                        property={data}
                        id={data.id ?? -1}
                        updatePropertyInformation={updateMaintenanceInformation}
                      />
                    ),
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }}
              />
            </Card.Header>
            <Card.Body className="text-start">
              <Row className="g-3">
                <Col lg={4} sm={6}>
                  <RenderInformation
                    title="Maintenance Limit"
                    description={data.maintenance_limit_amount}
                    desClass={'price-symbol'}
                  />
                </Col>
                <Col lg={4} sm={6}>
                  <RenderInformation title="Insurance Expiration" date={data.insurance_expiration_date} />
                </Col>
                <Col xs={12}>
                  <RenderInformation
                    title="Has home warranty coverage?"
                    description={data.has_home_warranty_coverage ? 'Yes' : 'No'}
                  />
                </Col>
                <Col lg={4} sm={6}>
                  <RenderInformation title="Home warranty company" description={data.home_warranty_company} />
                </Col>
                <Col lg={4} sm={6}>
                  <RenderInformation title="Warranty Expiration" date={data.home_warranty_expiration_date} />
                </Col>
              </Row>
              <RenderInformation title="Maintenance Notes" description={data.maintenance_notes} />
            </Card.Body>
          </Card>
        );
      }}
    />
  );
};

export default MaintenanceInformation;
