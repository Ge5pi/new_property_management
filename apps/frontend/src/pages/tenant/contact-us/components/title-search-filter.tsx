import { Col, Row } from 'react-bootstrap';

import { SearchInput } from 'components/search-input';

const TitleSearchFilter = () => {
  return (
    <div className="component-margin-y">
      <Row className="gx-2">
        <Col className="order-sm-0 order-1">
          <h1 className="fw-bold h4 text-capitalize">Contacts</h1>
        </Col>
        <Col lg="auto" sm xs={12}>
          <Row className="gx-2 gy-1">
            <Col>
              <Row className="gx-2 gy-1">
                <Col>
                  <SearchInput size="sm" />
                </Col>
              </Row>
            </Col>
          </Row>
        </Col>
      </Row>
    </div>
  );
};

export default TitleSearchFilter;
