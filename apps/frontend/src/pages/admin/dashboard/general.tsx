import { Fragment } from 'react';
import { Col, Row } from 'react-bootstrap';

import { useAuthState } from 'hooks/useAuthState';

import { PERMISSIONS } from 'constants/permissions';

import ExpiringLeases from './components/general/expiring-leases';
import PendingMoveIns from './components/general/pending-move-ins';
import Portfolio from './components/general/portfolio';
import RecentNotes from './components/general/recent-notes';
import RentalApplications from './components/general/rental-applications';
import ServiceRequest from './components/general/service-request';
import WorkOrders from './components/general/work-orders';

const General = () => {
  const { isAccessible } = useAuthState();
  return (
    <div className="mt-4">
      {isAccessible(PERMISSIONS.MAINTENANCE) && (
        <Fragment>
          <ServiceRequest />
          <WorkOrders />
        </Fragment>
      )}

      {isAccessible(PERMISSIONS.LEASING) && (
        <Fragment>
          <RentalApplications />
          <Row className="mb-3 align-items-stretch gy-3 gx-3">
            <Col lg={6}>
              <ExpiringLeases />
            </Col>
            <Col lg={6}>
              <PendingMoveIns />
            </Col>
          </Row>
        </Fragment>
      )}
      {isAccessible(PERMISSIONS.COMMUNICATION) && <RecentNotes />}
      {isAccessible(PERMISSIONS.PROPERTY) && (
        <Fragment>
          <hr className="my-4" />
          <Portfolio />
        </Fragment>
      )}
    </div>
  );
};

export default General;
