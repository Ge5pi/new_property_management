import { Col, ListGroup, Row } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { reportsData } from './reports-data';

const Reports = () => {
  return (
    <div className="component-margin-y">
      <h1 className="fw-bold h4 text-capitalize">Reports</h1>

      <Row className="gx-0 gy-3 reports-wrapper mt-4">
        {reportsData.map(({ id, items, title, classNames, divider }) =>
          divider ? (
            <hr key={id} className="border" />
          ) : (
            <Col sm={3} key={id} className={classNames}>
              <ListGroup className="px-4" variant="flush">
                <ListGroup.Item className="bg-transparent border-0">
                  <p className="text-primary fw-bold m-0">{title}</p>
                </ListGroup.Item>
                {items &&
                  items.length > 0 &&
                  items.map(({ id, title, link }) => (
                    <ListGroup.Item key={id} className="bg-transparent border-0">
                      <Link to={link}>
                        <u className="text-info m-0">{title}</u>
                      </Link>
                    </ListGroup.Item>
                  ))}
              </ListGroup>
            </Col>
          )
        )}
      </Row>
    </div>
  );
};

export default Reports;
