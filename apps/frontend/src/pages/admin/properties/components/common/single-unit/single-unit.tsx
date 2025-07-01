import { Col, Row, Stack } from 'react-bootstrap';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetUnitTypeByIdQuery } from 'services/api/unit-types';

import { InlineSkeleton } from 'components/skeleton';

import { BathroomIcon, BedIcon, DotIcon } from 'core-ui/icons';
import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { getIDFromObject } from 'utils/functions';

import { IListUnits } from 'interfaces/IUnits';

interface IProps {
  unit: IListUnits;
}

const SingleUnit = ({ unit }: IProps) => {
  const unitType = useGetUnitTypeByIdQuery(getIDFromObject('unit_type', unit));

  return (
    <Row className="item-hover shadow-sm border gx-0 px-3 py-4 justify-content-between align-items-end">
      <Col md={4} sm={6} xs="auto">
        <RenderInformation
          title={unit.name}
          titleClass="fw-bold fs-6 mb-2 text-truncate"
          containerClass="text-start"
          html={
            <div>
              {unit.is_occupied ? (
                <p className="unit-occupied small mb-1">
                  Occupied
                  <span className="mx-1">
                    <DotIcon />
                  </span>
                </p>
              ) : (
                <p className="unit-available small mb-1">
                  Available
                  <span className="mx-1">
                    <DotIcon />
                  </span>
                </p>
              )}
              <ApiResponseWrapper
                {...unitType}
                showError={false}
                renderIfNoResult={false}
                loadingComponent={
                  <Stack direction="horizontal" gap={3}>
                    <InlineSkeleton size="xs" xl={2} lg={3} sm={2} xs={6} />
                    <InlineSkeleton size="xs" xl={2} lg={3} sm={2} xs={6} />
                  </Stack>
                }
                renderResults={unit_type => (
                  <Stack direction="horizontal" gap={1} className="mb-lg-0 mb-3">
                    <div>
                      <p className="text-primary fw-medium small mb-0">
                        <BedIcon /> <span className="mx-1">{unit_type.bed_rooms ?? 0}</span>
                      </p>
                    </div>
                    <div className="vr mx-2" />
                    <div>
                      <p className="text-primary fw-medium small mb-0">
                        <BathroomIcon /> <span className="mx-1">{unit_type.bath_rooms ?? 0}</span>
                      </p>
                    </div>
                  </Stack>
                )}
              />
            </div>
          }
          containerMargin={false}
        />
      </Col>
      <Col lg sm={6} xs="auto">
        <RenderInformation
          title="Monthly Rent"
          description={unit.market_rent}
          titleClass="fw-light mb-2"
          desClass="price-symbol text-primary fw-medium mb-lg-0 mb-3 small"
          containerMargin={false}
        />
      </Col>
      <Col lg sm={6}>
        <RenderInformation
          title="Lease start-end"
          html={
            <Stack direction="horizontal" gap={1} className="align-items-center">
              <RenderInformation
                title=""
                date={unit.lease_start_date}
                desClass="text-primary fw-medium mb-lg-0 mb-3 small"
                containerMargin={false}
                showDateIcon={false}
              />
              <span>-</span>
              <RenderInformation
                title=""
                date={unit.lease_end_date}
                desClass="text-primary fw-medium mb-lg-0 mb-3 small"
                containerMargin={false}
                showDateIcon={false}
              />
            </Stack>
          }
          titleClass="fw-light mb-2"
          containerMargin={false}
        />
      </Col>
      <Col lg={3} sm={6}>
        <RenderInformation
          title="Related to"
          html={
            <div className="mb-lg-0 mb-3">
              {unit.tenant_first_name && unit.tenant_last_name ? (
                <Avatar
                  suffixClassName="small fw-medium"
                  name={`${unit.tenant_first_name} ${unit.tenant_last_name}`}
                  showName={true}
                  size={28}
                />
              ) : (
                '-'
              )}
            </div>
          }
          titleClass="fw-light mb-2"
          containerMargin={false}
        />
      </Col>
    </Row>
  );
};

export default SingleUnit;
