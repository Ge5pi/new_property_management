import { useEffect, useState } from 'react';
import { Button, Card, Col, Row } from 'react-bootstrap';
import { useLocation } from 'react-router-dom';

import { SearchInput } from 'components/search-input';

import { useRedirect } from 'hooks/useRedirect';

import ApprovalCRUD from './approval-crud';
import ApprovalDetail from './approval-detail';
import SingleApproval from './single-approval';

const Approvals = () => {
  const [childRender, handleChildRender] = useState({
    hash: '',
    render: '',
  });

  const { hash } = useLocation();
  const { redirect } = useRedirect();

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

  const handleItemClick = () => {
    redirect('#/details');
  };

  const handleCreateNewRecord = () => {
    redirect('#/create');
  };

  if (childRender.render === 'crud') {
    return <ApprovalCRUD state={childRender.hash} />;
  }

  if (childRender.render === 'details') {
    return <ApprovalDetail />;
  } else {
    return (
      <div className="container-fluid px-xl-4 page-section py-4">
        <Row className="align-items-center gx-3 gy-4">
          <Col className="order-sm-0 order-1">
            <Card.Title className="fw-bold fs-6">List of all Approvals</Card.Title>
            <Card.Text className="fw-medium small">Total: 12</Card.Text>
          </Col>
          <Col lg={'auto'} md={8} sm={7} xs={12}>
            <Row className="gx-2 gy-1">
              <Col>
                <SearchInput size="sm" />
              </Col>
              <Col xs={'auto'}>
                <Button
                  variant={'primary'}
                  size="sm"
                  className="btn-search-adjacent-sm"
                  onClick={handleCreateNewRecord}
                >
                  Add New
                </Button>
              </Col>
            </Row>
          </Col>
        </Row>

        <div className="my-3" onClick={handleItemClick}>
          <SingleApproval />
        </div>
      </div>
    );
  }
};

export default Approvals;
