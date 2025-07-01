import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetPropertyByIdQuery, useUpdatePropertiesInformationMutation } from 'services/api/properties';

import { InformationSkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { PropertyInformationModal } from 'core-ui/popups/property-information';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { PERMISSIONS } from 'constants/permissions';
import { formatPricing, getValidID, isNegativeNumber } from 'utils/functions';

interface IProps {
  currentRoute: 'association' | 'property';
}
const PropertyInformation = ({ currentRoute }: IProps) => {
  const { property: property_id } = useParams();

  // get property by id
  const property = useGetPropertyByIdQuery(getValidID(property_id));
  const [
    updatePropertyInformation,
    { isSuccess: isUpdatePropertyInfoSuccess, isError: isUpdatePropertyInfoError, error: updatePropertyInfoError },
  ] = useUpdatePropertiesInformationMutation();

  useResponse({
    isSuccess: isUpdatePropertyInfoSuccess,
    successTitle: 'Property Information has been successfully updated!',
    isError: isUpdatePropertyInfoError,
    error: updatePropertyInfoError,
  });

  return (
    <ApiResponseWrapper
      {...property}
      showMiniError
      loadingComponent={
        <InformationSkeleton skeletonType="column" title={false} columnCount={8} lg={6} md={12} sm={6}>
          <InformationSkeleton lines="single" />
        </InformationSkeleton>
      }
      renderResults={data => {
        return (
          <Card className="min-h-100">
            <Card.Header className="border-0 py-3 bg-transparent text-start">
              <p className="fw-bold m-0 text-primary">Property Information</p>
              <EditBtn
                className="position-absolute top-0 end-0 m-2"
                permission={PERMISSIONS.PROPERTY}
                onClick={() => {
                  SweetAlert({
                    size: 'lg',
                    html: (
                      <PropertyInformationModal
                        property={data}
                        id={data.id ?? -1}
                        updatePropertyDetails={updatePropertyInformation}
                      />
                    ),
                  }).fire({
                    allowOutsideClick: () => !SwalExtended.isLoading(),
                  });
                }}
              />
            </Card.Header>
            <Card.Body className="text-start">
              <RenderInformation title="Description" description={data.description} />

              <RenderInformation title="Portfolio" description={data.portfolio} />

              <Row className="gx-0">
                <Col lg={6} md={12} sm={6}>
                  <RenderInformation title="Tax Authority" description={data.tax_authority} />
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <RenderInformation title="Renters tax location code" description={data.renters_tax_location_code} />
                </Col>
              </Row>

              <RenderInformation title={`${currentRoute} owner license`} description={data.property_owner_license} />

              <Row className="gx-0">
                <Col lg={6} md={12} sm={6}>
                  <RenderInformation title="Year built" description={data.year_built} />
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <RenderInformation title="Class" description="-" />
                </Col>

                <Col lg={6} md={12} sm={6}>
                  <RenderInformation title="Management start date" date={data.management_start_date} />
                </Col>
                <Col lg={6} md={12} sm={6}>
                  <RenderInformation title="Management end date" date={data.management_end_date} />
                </Col>
              </Row>

              <RenderInformation title="Management end reason" description={data.management_end_reason?.name} />
            </Card.Body>
            <Card.Footer className="border-0 bg-transparent text-end">
              <p
                className={clsx('text-success fw-bold', {
                  'price-symbol': data.nsf_fee,
                  '-ive': data.nsf_fee && isNegativeNumber(data.nsf_fee),
                })}
              >
                {data.nsf_fee ? `${formatPricing(data.nsf_fee)} NFS Fee` : 'N/A'}
              </p>
            </Card.Footer>
          </Card>
        );
      }}
    />
  );
};

export default PropertyInformation;
