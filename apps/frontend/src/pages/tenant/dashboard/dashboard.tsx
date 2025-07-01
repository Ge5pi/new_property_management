import { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';

import PageContainer from 'components/page-container';

import LeaseInformation from '../../../components/tenant-lease-information/lease-information';
import Announcements from './components/announcements';
import MaintenanceRequests from './components/maintenance-requests';
import MyBalance from './components/my-balance';
import WorkOrderList from './components/work-order-list';

function Dashboard() {
  return (
    <Fragment>
      <PageContainer>
        <div className="mb-4">
          <Row className="g-3 align-items-stretch">
            <Col lg={8} md={6}>
              <Announcements />
            </Col>
            <Col lg={4} md={6} className="order-md-last order-first">
              <MyBalance />
            </Col>
          </Row>
        </div>
        <div className="mb-4">
          <Row className="g-3 align-item-stretch">
            <Col lg={4} md={6}>
              <WorkOrderList />
            </Col>
            <Col lg={4} md={6}>
              <MaintenanceRequests />
            </Col>
            <Col lg={4} md={6}>
              <LeaseInformation />
            </Col>
          </Row>
        </div>
      </PageContainer>
    </Fragment>
  );
}

export default Dashboard;
