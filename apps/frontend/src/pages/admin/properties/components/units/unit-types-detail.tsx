import { lazy } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetUnitTypeByIdQuery, useUpdateUnitTypesInformationMutation } from 'services/api/unit-types';

import PageContainer from 'components/page-container';

import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { UnitTypesModal } from 'core-ui/popups/units';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID, isPositiveNumber } from 'utils/functions';

import { ISingleUnitType } from 'interfaces/IUnits';

const UnitTypeGallery = lazy(() => import('./unit-type-photos'));
const Amenities = lazy(() => import('../common/amenities/amenities'));
const RentalInformation = lazy(() => import('../common/rental-information/rental-information'));
const MarketingInformation = lazy(() => import('./marketing-information'));

const UnitTypesDetail = () => {
  const [width] = useWindowSize();
  const { property: property_id, type: unit_type_id } = useParams();

  // get unit-type by id
  const unit_type = useGetUnitTypeByIdQuery(getValidID(unit_type_id));

  const [
    updateUnitTypeRentalInformation,
    { isSuccess: isUpdateRentalInfoSuccess, isError: isUpdateRentalInfoError, error: updateRentalInfoError },
  ] = useUpdateUnitTypesInformationMutation();

  useResponse({
    isSuccess: isUpdateRentalInfoSuccess,
    successTitle: 'Rental Information has been successfully updated!',
    isError: isUpdateRentalInfoError,
    error: updateRentalInfoError,
  });

  const handleRentalInformation = async (values: Partial<ISingleUnitType>) => {
    if (isPositiveNumber(unit_type_id) && isPositiveNumber(property_id)) {
      return await updateUnitTypeRentalInformation({
        ...values,
        id: Number(unit_type_id),
        parent_property: Number(property_id),
      });
    }

    return Promise.reject('Incomplete data found');
  };

  return (
    <ApiResponseWrapper
      {...unit_type}
      renderResults={data => {
        return (
          <PageContainer>
            <div className="container-fluid page-section pt-5 pb-4">
              <Row className="gx-3 gy-4 align-items-stretch">
                <Col xxl={width <= 1600 ? 4 : 3} lg={4}>
                  <section className="d-flex flex-column h-100">
                    <div>
                      <Card className="align-items-center p-3">
                        <Card.Img as={LazyImage} border src={data.cover_picture} size="16x9" />
                        <Card.Body className="ps-0 w-100 pe-lg-4 pe-md-5 pe-1 pt-2 pb-3 text-start">
                          <Card.Title className="fw-bold">{data.name}</Card.Title>
                        </Card.Body>
                        <EditBtn
                          className="position-absolute bottom-0 end-0 m-2"
                          permission={PERMISSIONS.PROPERTY}
                          onClick={() => {
                            if (property_id) {
                              SweetAlert({
                                size: 'lg',
                                html: <UnitTypesModal update={true} unitType={data} property={property_id} />,
                              }).fire({
                                allowOutsideClick: () => !SwalExtended.isLoading(),
                              });
                            }
                          }}
                        />
                      </Card>
                    </div>
                    <div className="mt-3 flex-fill">
                      <Amenities from="unit-types" data={data} />
                    </div>
                  </section>
                </Col>
                <Col xl lg={8}>
                  <RentalInformation
                    {...data}
                    rental_information_for="UNIT_TYPE"
                    onRentalInformationUpdate={handleRentalInformation}
                    unit_type_id={Number(data.id)}
                    market_rent={data.market_rent}
                  />
                </Col>
                <Col xs={12}>
                  <MarketingInformation data={data} />
                </Col>
              </Row>
            </div>

            <div className="my-4 page-section">
              <UnitTypeGallery />
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default UnitTypesDetail;
