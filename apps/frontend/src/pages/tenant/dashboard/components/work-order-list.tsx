import { Fragment } from 'react';
import { Card } from 'react-bootstrap';
import { Link } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetTenantWorkOrdersQuery } from 'services/api/tenants/work-orders';

import { RecurringIcon } from 'core-ui/icons';

import { displayDate } from 'utils/functions';

import { IWorkOrdersAPI } from 'interfaces/IWorkOrders';

function WorkOrderList() {
  const work_orders = useGetTenantWorkOrdersQuery({ size: 5, page: 1 });

  return (
    <Card className="page-section border min-h-100">
      <Card.Header className="p-0 bg-transparent px-4 py-3 border">
        <h2 className="fw-bold fs-5 m-0">Work Orders</h2>
      </Card.Header>
      <Card.Body className="p-0 overflow-auto" style={{ maxHeight: 450 }}>
        <ApiResponseWrapper
          {...work_orders}
          showMiniError
          renderResults={data => {
            const orders: Array<IWorkOrdersAPI | string> = [...data.results];
            if (data.count > 12) {
              orders.push('record-view-all');
            }

            if (data.results.length <= 0) {
              return (
                <div className="position-relative d-flex justify-content-between px-4 py-5 my-5">
                  <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                    No Record Found
                  </div>
                </div>
              );
            }

            return (
              <Fragment>
                {orders.map(order =>
                  typeof order === 'string' ? (
                    <Link key={order} to={`/tenant/requests/work-orders`}>
                      <div className="position-relative border-bottom last-border-0 d-flex justify-content-between px-4 py-2">
                        <div className="d-flex flex-column gap-2 position-absolute top-50 start-50 translate-middle align-items-center justify-content-center">
                          view all
                        </div>
                      </div>
                    </Link>
                  ) : (
                    <div
                      key={order.id}
                      className="border-bottom last-border-0 d-flex justify-content-between px-4 py-3"
                    >
                      <div>
                        <p className="text-uppercase fw-bold m-0 small lh-1">{order.slug}</p>
                        <p className="x-small m-0">{order.property_name}</p>
                        {order.is_recurring && (
                          <div className="d-flex align-items-center text-muted">
                            <span className="me-1">
                              <RecurringIcon />
                            </span>
                            <span className="small">Recurring</span>
                          </div>
                        )}
                      </div>
                      <div>
                        <p className="text-success text-end small fw-medium">
                          {order.get_status_display}
                          <span className="d-inline-block fs-6 ms-2 bg-success rounded p-1" />
                        </p>
                        <p className="small text-muted m-0">{displayDate(order.follow_up_date)}</p>
                      </div>
                    </div>
                  )
                )}
              </Fragment>
            );
          }}
        />
      </Card.Body>
    </Card>
  );
}

export default WorkOrderList;
