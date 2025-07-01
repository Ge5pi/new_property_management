import { Col, Row, Stack } from 'react-bootstrap';

import { BathroomIcon, BedIcon } from 'core-ui/icons';
import { LazyImage } from 'core-ui/lazy-image';
import { RenderInformation } from 'core-ui/render-information';

import { IListUnitTypes } from 'interfaces/IUnits';

const SingleUnitType = ({ unitType }: { unitType: IListUnitTypes }) => {
  return (
    <Row className="item-hover shadow-sm border gx-0 px-3 py-4 justify-content-between align-items-center">
      <Col md={4} sm={6} xs="auto">
        <Row className="gx-0 mb-sm-0 mb-3">
          <Col xs={'auto'}>
            <LazyImage src={unitType.cover_picture} border size="sm" />
          </Col>
          <Col sm xs={'auto'}>
            <div className="mx-3">
              <p className="fw-bold mb-0">{unitType.name}</p>
              <Stack direction="horizontal" gap={1} className="mt-1">
                <div>
                  <p className="text-primary fw-medium mb-0">
                    <BedIcon /> <span className="mx-1 small">{unitType.bed_rooms ?? 0}</span>
                  </p>
                </div>
                <div className="vr mx-2" />
                <div>
                  <p className="text-primary fw-medium mb-0">
                    <BathroomIcon /> <span className="mx-1 small">{unitType.bath_rooms ?? 0}</span>
                  </p>
                </div>
              </Stack>
            </div>
          </Col>
        </Row>
      </Col>
      <Col xxl={3} sm={4} xs={12}>
        <RenderInformation
          title="Monthly Rent"
          description={unitType.market_rent}
          titleClass="fw-light mb-2"
          desClass="price-symbol text-primary fw-medium mb-sm-0 mb-3 small"
          containerMargin={false}
        />
      </Col>
    </Row>
  );
};

export default SingleUnitType;
