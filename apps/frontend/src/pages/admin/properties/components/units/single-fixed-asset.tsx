import { Card, Col, Row } from 'react-bootstrap';

import { IFixedAssets } from 'interfaces/IAssets';

interface ICellProp {
  value: IFixedAssets;
}

const SingleFixedAsset = ({ value }: ICellProp) => {
  return (
    <Card className="single-section-item">
      <Card.Body>
        <Row className="g-0 align-items-center">
          <Col>
            <p className="text-uppercase fw-bold text-primary mb-0">{value.slug}</p>
            <p className="small mb-sm-0 mb-1 text-truncate text-capitalize">{value.inventory_name}</p>
          </Col>
          <Col xs="auto">
            <div className="mx-sm-3 mx-1">
              <p className="fw-light mb-sm-1 mb-0">Installed date</p>
              <p className="text-primary mb-sm-0 mb-1 fw-medium">{value.placed_in_service_date}</p>
            </div>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default SingleFixedAsset;
