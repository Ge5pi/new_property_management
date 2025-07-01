import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetRentableItemByIdQuery } from 'services/api/rentable';

import PageContainer from 'components/page-container';

import { EditBtn } from 'core-ui/edit-button';
import { RentalItemModal } from 'core-ui/popups/rentable-items';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended, SweetAlert } from 'core-ui/sweet-alert';
import { Avatar } from 'core-ui/user-avatar';

import { PERMISSIONS } from 'constants/permissions';
import { getValidID } from 'utils/functions';

const RentableItemDetail = () => {
  const { property: property_id, rentable: rentable_id } = useParams();

  // get property by id
  const item = useGetRentableItemByIdQuery(getValidID(rentable_id));

  return (
    <ApiResponseWrapper
      {...item}
      renderResults={data => {
        return (
          <PageContainer>
            <div className="container-fluid page-section pt-5 pb-3">
              <Card className="border-0">
                <Row className="gx-3 gb-4 align-items-center justify-content-between">
                  <Col xs={12}>
                    <Card.Header className="border-0 pb-3 bg-transparent text-start">
                      <div>
                        <p className="fw-bold m-0 text-primary">Rentable item details</p>
                        <p className="small">You can make changes if required</p>
                      </div>
                      <EditBtn
                        className="position-absolute top-0 end-0 m-2"
                        permission={PERMISSIONS.PROPERTY}
                        onClick={() => {
                          SweetAlert({
                            size: 'lg',
                            html: <RentalItemModal update items={data} property_id={property_id} />,
                          }).fire({
                            allowOutsideClick: () => !SwalExtended.isLoading(),
                          });
                        }}
                      />
                    </Card.Header>
                  </Col>
                  <Col xl={6} lg={7}>
                    <Card.Body className="text-start">
                      <RenderInformation title="Item Name" description={data.name} />
                      <Row className="justify-content-sm-start justify-content-between gy-0 gx-sm-4 gx-2">
                        <Col xs={'auto'}>
                          <div className="me-1">
                            <RenderInformation title="Amount" desClass="price-symbol" description={data.amount} />
                          </div>
                        </Col>
                        <Col xs={'auto'}>
                          <div className="ms-1">
                            <RenderInformation title="GL Account" description={data.gl_account} />
                          </div>
                        </Col>
                      </Row>

                      <RenderInformation title="Description" description={data.description} />
                    </Card.Body>
                  </Col>
                  <Col lg={4} md={'auto'}>
                    <Card.Body className="text-start">
                      <RenderInformation
                        title="Tenant"
                        html={
                          <div>
                            {data.tenant_first_name && data.tenant_last_name ? (
                              <Avatar name={`${data.tenant_first_name} ${data.tenant_last_name}`} showName size={30} />
                            ) : (
                              '-'
                            )}
                          </div>
                        }
                      />

                      <div className="mx-md-0 mx-sm-2 mx-1 mb-4">
                        <div className="form-switch d-inline-flex align-items-center">
                          <div className={clsx('form-check-input', { 'checked-switch-green': data.status })}></div>
                          <div className="form-check-label">{data.status ? 'Active' : 'Inactive'}</div>
                        </div>
                      </div>
                    </Card.Body>
                  </Col>
                </Row>
              </Card>
            </div>
          </PageContainer>
        );
      }}
    />
  );
};

export default RentableItemDetail;
