import { Card, Col, Row, Stack } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetPortfolioPropertiesQuery } from 'services/api/dashboard';

import { NewTabIcon } from 'core-ui/icons';
import { LazyImage } from 'core-ui/lazy-image';

function Portfolio() {
  const portfolio = useGetPortfolioPropertiesQuery({ size: 10 });

  return (
    <div>
      <h2 className="fw-bold fs-5 my-4">Portfolio</h2>
      <ApiResponseWrapper
        {...portfolio}
        showMiniError
        renderResults={data => (
          <Row className="gy-4 gx-sm-3 gx-1">
            {data.results.length <= 0 ? (
              <Col xs={12}>
                <div className="text-center text-muted">No Result Found</div>
              </Col>
            ) : (
              data.results.map(item => (
                <Col key={item.id} xxl={3} lg={4} sm={6}>
                  <Card className="page-section border-0">
                    <Card.Body className="p-0">
                      <div className="mb-2">
                        <Card.Img as={LazyImage} src={item.cover_picture} size="4x3" />
                        {/* <LazyImage
                          // text={item.name}
                          className="card-img-top property-card-image mb-2"
                          src={item.cover_picture}
                        /> */}
                      </div>
                      <Stack direction="horizontal" className="py-2 px-4 align-items-center justify-content-between">
                        <div className="text-center">
                          <p className="fw-bold fs-5 m-0">{item.units_count}</p>
                          <p className="fw-medium fs-5 m-0">Units</p>
                        </div>
                        <div className="text-center">
                          <p className="fw-bold m-0">{item.vacant_units_count}</p>
                          <p className="m-0">Vacant</p>
                        </div>
                        <div className="text-center">
                          <p className="fw-bold m-0">{item.occupied_units_count}</p>
                          <p className="m-0">Rented</p>
                        </div>
                      </Stack>
                      <hr />
                      <Stack direction="horizontal" className="px-4 justify-content-between align-items-start">
                        <div>
                          <p className="fw-medium small text-danger">Vacant for {item.vacant_for_days ?? 0} days</p>
                        </div>
                      </Stack>
                    </Card.Body>
                  </Card>
                </Col>
              ))
            )}
            {data.count > 10 && (
              <Col xxl={3} lg={4} sm={6}>
                <div>
                  <Link to={`/admin/properties`}>
                    <div>
                      <Card className="item-hover portfolio-view-more">
                        <Card.Body className="position-relative border border-opacity-50 p-3">
                          <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                            <NewTabIcon width={52} height={52} />
                            View all
                          </div>
                        </Card.Body>
                      </Card>
                    </div>
                  </Link>
                </div>
              </Col>
            )}
          </Row>
        )}
      />
    </div>
  );
}

export default Portfolio;
