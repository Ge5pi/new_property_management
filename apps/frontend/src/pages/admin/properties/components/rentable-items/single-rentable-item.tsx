import { Col, Row } from 'react-bootstrap';

import { clsx } from 'clsx';

import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { IRentableItems } from 'interfaces/IRentableItems';

const SingleRentableItem = ({ item }: { item: IRentableItems }) => {
  return (
    <Row className="item-hover shadow-sm border gx-0 px-3 py-4 justify-content-between">
      <Col md={4} sm={6} xs="auto">
        <RenderInformation
          title={item.name}
          description={item.status ? 'Active' : 'Inactive'}
          desClass={clsx(
            'text-primary fw-medium mb-lg-0 mb-3 small',
            { 'text-success': item.status },
            { 'text-warning': !item.status }
          )}
          titleClass="fw-bold fs-6 mb-2"
          containerClass="text-start"
          containerMargin={false}
        />
      </Col>
      <Col lg sm={6} xs="auto">
        <RenderInformation
          title="Amount"
          description={item.amount}
          titleClass="fw-light mb-2"
          desClass="price-symbol text-primary small fw-medium mb-lg-0 mb-3"
          containerMargin={false}
        />
      </Col>
      <Col lg sm={6}>
        <RenderInformation
          title="GL Account"
          description={item.gl_account}
          titleClass="fw-light mb-2"
          desClass="text-primary fw-medium small mb-lg-0 mb-3"
          containerMargin={false}
        />
      </Col>
      <Col lg={3} sm={6}>
        <RenderInformation
          title="Related to"
          html={
            <div className="mb-lg-0 mb-3">
              {item.tenant_first_name && item.tenant_last_name ? (
                <Avatar
                  suffixClassName="small fw-bold"
                  name={`${item.tenant_first_name} ${item.tenant_last_name}`}
                  showName
                  size={28}
                />
              ) : (
                '-'
              )}
            </div>
          }
          titleClass="fw-light mb-2"
          containerMargin={false}
        />
      </Col>
    </Row>
  );
};

export default SingleRentableItem;
