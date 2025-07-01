import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { SearchInput } from 'components/search-input';

import ArchitecturalReviewCRUD from './architectural-review-crud';
import ArchitecturalReviewDetail from './architectural-review-detail';
import SingleArchitecturalReview from './single-architectural-review';

const ArchitecturalReviews = () => {
  const [childRender, handleChildRender] = useState({
    hash: '',
    render: '',
  });

  const { hash } = useLocation();
  useEffect(() => {
    if (hash === '#/details') {
      handleChildRender({
        hash: hash,
        render: 'details',
      });
    } else if (hash === '#/edit' || hash === '#/create') {
      handleChildRender({
        hash: hash,
        render: 'crud',
      });
    }

    return () => {
      handleChildRender({
        hash: '',
        render: '',
      });
    };
  }, [hash]);

  if (childRender.render === 'crud') {
    return <ArchitecturalReviewCRUD state={childRender.hash} />;
  } else if (childRender.render === 'details') {
    return <ArchitecturalReviewDetail />;
  } else {
    return (
      <div className="container-fluid px-xl-4 page-section py-4">
        <Row className="align-items-center gx-3 gy-4">
          <Col className="order-sm-0 order-1">
            <Card.Title className="fw-bold fs-6">List of all Architectural Reviews</Card.Title>
            <Card.Text className="fw-medium small">Total: 12</Card.Text>
          </Col>
          <Col lg={'auto'} md={8} sm={7} xs={12}>
            <Row className="gx-2 gy-1">
              <Col>
                <SearchInput size="sm" />
              </Col>
              <Col xs={'auto'}>
                <Button variant={'primary'} size="sm" className="btn-search-adjacent-sm">
                  Add New
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="my-3">
          <SingleArchitecturalReview />
        </div>
      </div>
    );
  }
};

export default ArchitecturalReviews;
