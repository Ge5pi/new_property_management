import { lazy } from 'react';
import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetChargesQuery } from 'services/api/charges';
import { useGetFixedAssetsQuery } from 'services/api/fixed-assets';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreateUnitUpcomingActivityMutation,
  useGetUnitByIdQuery,
  useGetUnitUpcomingActivitiesQuery,
  useUpdateUnitsInformationMutation,
} from 'services/api/units';

import { ItemDate, ItemStatus } from 'components/custom-cell';
import { ListingWithPagination } from 'components/listing';
import PageContainer from 'components/page-container';
import { TableWithPagination } from 'components/table';

import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { UnitsModal } from 'core-ui/popups/units';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { formatPricing, getValidID, isNegativeNumber, isPositiveNumber } from 'utils/functions';

import { IChargesAPI } from 'interfaces/IAccounting';
import { IFixedAssets } from 'interfaces/IAssets';
import { ISingleUnit, IUnitsUpcomingActivities } from 'interfaces/IUnits';
import { IUpcomingActivities } from 'interfaces/IUpcomingActivities';

import RentalInformation from '../common/rental-information/rental-information';
import BalanceSummary from './balance-summary';
import SingleFixedAsset from './single-fixed-asset';
import TransactionsInformation from './transactions-information';
import UnitInformation from './unit-information';
import UnitLeaseInformation from './unit-lease-information';

const UpcomingActivities = lazy(() => import('components/upcoming-activities/upcoming-activities'));

interface ICellProp {
  value: IFixedAssets;
}

const UnitDetail = () => {
  const [width] = useWindowSize();
  const { redirect } = useRedirect();
  const { property: property_id, unit: unit_id } = useParams();

  // get property by id
  const unit = useGetUnitByIdQuery(getValidID(unit_id));
  const upcoming_activities = useGetUnitUpcomingActivitiesQuery(getValidID(unit_id));

  const [
    createUpcomingActivity,
    {
      isSuccess: isCreateUpcomingActivitySuccess,
      isError: isCreateUpcomingActivityError,
      error: createUpcomingActivityError,
    },
  ] = useCreateUnitUpcomingActivityMutation();

  useResponse({
    isSuccess: isCreateUpcomingActivitySuccess,
    successTitle: 'New Upcoming Activity has been added',
    isError: isCreateUpcomingActivityError,
    error: createUpcomingActivityError,
  });
  const handleUpcomingActivity = async (values: IUpcomingActivities) => {
    if (!isNaN(Number(unit_id)) && Number(unit_id) > 0) {
      return await createUpcomingActivity({ ...values, unit: Number(unit_id) } as IUnitsUpcomingActivities);
    }

    return Promise.reject('Incomplete data found');
  };

  const [
    updateUnitRentalInformation,
    { isSuccess: isUpdateRentalInfoSuccess, isError: isUpdateRentalInfoError, error: updateRentalInfoError },
  ] = useUpdateUnitsInformationMutation();

  useResponse({
    isSuccess: isUpdateRentalInfoSuccess,
    successTitle: 'Rental Information has been successfully updated!',
    isError: isUpdateRentalInfoError,
    error: updateRentalInfoError,
  });

  const handleRentalInformation = async (values: Partial<ISingleUnit>) => {
    if (isPositiveNumber(unit_id) && isPositiveNumber(property_id)) {
      return await updateUnitRentalInformation({
        ...values,
        id: Number(unit_id),
        parent_property: Number(property_id),
      });
    }

    return Promise.reject('Incomplete data found');
  };

  return (
    <ApiResponseWrapper
      {...unit}
      renderResults={data => {
        return (
          <PageContainer>
            <div className="container-fluid page-section pt-5 pb-3">
              <Row className="gx-3 gy-4 align-items-stretch">
                <Col xxl={width <= 1600 ? 4 : 3} lg={4}>
                  <Card className="align-items-center p-3 min-h-100">
                    <Card.Img as={LazyImage} border src={data.cover_picture} size="16x9" />
                    <Card.Body className="px-0 w-100">
                      <Row className="g-0 justify-content-between">
                        <Col>
                          <Card.Title className="fw-bold">{data.name}</Card.Title>
                          <Card.Subtitle className="small mb-3">{data.unit_type_name}</Card.Subtitle>
                        </Col>
                        <Col xs={'auto'}>
                          {data.is_occupied === true ? (
                            <p className="py-1 px-2 badge rounded-pill unit-occupied-bg">Occupied</p>
                          ) : (
                            <p className="py-1 px-2 badge rounded-pill unit-available-bg">Available</p>
                          )}
                        </Col>
                      </Row>
                      <Card.Text className="text-primary fw-medium pe-lg-4 pe-md-5 pe-1 pt-0 pb-3 text-start">
                        {data.address}
                      </Card.Text>
                    </Card.Body>
                    {property_id && (
                      <EditBtn
                        className="position-absolute bottom-0 end-0 m-2"
                        permission={PERMISSIONS.PROPERTY}
                        onClick={() => {
                          SweetAlert({
                            size: 'xl',
                            html: <UnitsModal unit={data} update={true} property={property_id} />,
                          }).fire({
                            allowOutsideClick: () => !SwalExtended.isLoading(),
                          });
                        }}
                      />
                    )}
                  </Card>
                </Col>
                <Col xl lg={8}>
                  <UpcomingActivities
                    {...upcoming_activities}
                    permission={PERMISSIONS.PROPERTY}
                    createUpcomingActivity={handleUpcomingActivity}
                  />
                </Col>
              </Row>
              <Row className="mt-1 gx-3 gy-4 align-items-stretch">
                <Col lg={7} md={6}>
                  <UnitInformation data={data} />
                </Col>
                <Col lg={5} md={6}>
                  <RentalInformation
                    {...data}
                    rental_information_for="UNIT"
                    onRentalInformationUpdate={handleRentalInformation}
                    unit_type_id={data.unit_type}
                  />
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <UnitLeaseInformation />
            </div>
            <div className="my-4">
              <Row className="mt-1 gx-3 align-items-stretch">
                <Col md={6}>
                  <div className="min-h-100 border page-section pgr-white">
                    <TableWithPagination
                      clickable
                      shadow={false}
                      showTotal={false}
                      pageHeader={<p className="fw-bold m-0 text-primary">Charges Information</p>}
                      saveValueInState
                      showHeaderInsideContainer
                      wrapperClass="detail-section-table"
                      newRecordButtonPermission={PERMISSIONS.ACCOUNTS}
                      searchable={false}
                      columns={[
                        {
                          Header: 'Charge',
                          accessor: 'unit_charge_detail',
                          Cell: ChargeUnitAmount,
                          minWidth: 300,
                        },
                        {
                          Header: 'Date',
                          accessor: 'created_at',
                          Cell: ItemDate,
                        },
                        {
                          Header: 'Status',
                          accessor: 'charge_status',
                          Cell: ItemStatus,
                        },
                      ]}
                      useData={useGetChargesQuery}
                      filterValues={{ unit: data.id?.toString() }}
                      onRowClick={row => {
                        if (row.original) {
                          const charge = row.original;
                          if ('id' in charge) {
                            redirect(`/accounts/receivables/charges/${charge.id}/details`, false, 'properties');
                          }
                        }
                      }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <TransactionsInformation title="Credits" />
                </Col>
              </Row>
            </div>

            <div className="my-4">
              <Row className="mt-1 gx-3 align-items-stretch">
                <Col md={6}>
                  <div className="min-h-100">
                    <ListingWithPagination
                      showHeaderInsideContainer
                      newRecordButtonPermission={PERMISSIONS.PROPERTY}
                      showTotal={false}
                      searchable={false}
                      shadow={false}
                      columns={[
                        {
                          Header: '',
                          accessor: 'original',
                          Cell: ({ value }: ICellProp) => <SingleFixedAsset value={value} />,
                        },
                      ]}
                      pageHeader={<p className="fw-bold m-0 text-primary">Fixed Assets</p>}
                      wrapperClass="bg-transparent detail-section-table"
                      classes={{ body: 'bg-transparent', header: 'bg-transparent' }}
                      useData={useGetFixedAssetsQuery}
                      filterValues={{ unit: data.id?.toString() }}
                    />
                  </div>
                </Col>
                <Col md={6}>
                  <BalanceSummary />
                </Col>
              </Row>
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

const ChargeUnitAmount = ({ value }: { value?: IChargesAPI }) => {
  if (!value) return <span>-</span>;
  return (
    <div>
      <div
        className={clsx(
          {
            '-ive': isNegativeNumber(value.amount),
          },
          'mb-0 fw-bold price-symbol'
        )}
      >
        {formatPricing(value.amount)}
      </div>
      <div className="small">{value.title}</div>
    </div>
  );
};

export default UnitDetail;
