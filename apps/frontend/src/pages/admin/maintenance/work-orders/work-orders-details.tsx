import { Card, Col, Container, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetServiceRequestsByIdQuery } from 'services/api/service-requests';
import { useGetUnitByIdQuery } from 'services/api/units';
import { useGetUserByIdQuery } from 'services/api/users';
import { useGetVendorTypesByIdQuery } from 'services/api/vendor-types';
import { useGetVendorsByIdQuery } from 'services/api/vendors';
import {
  useCreateWorkOrderLaborMutation,
  useGetWorkOrdersByIdQuery,
  useUpdateWorkOrderLaborMutation,
} from 'services/api/work-orders';

import { BackButton } from 'components/back-button';
import { Log } from 'components/log';
import PageContainer from 'components/page-container';
import Skeleton, { InformationSkeleton, PropertySkeleton } from 'components/skeleton';

import { EditBtn } from 'core-ui/edit-button';
import { LazyImage } from 'core-ui/lazy-image';
import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import { PERMISSIONS } from 'constants/permissions';
import { getIDFromObject, getValidID } from 'utils/functions';

import { ILabor } from 'interfaces/IWorkOrders';

import { LaborDetailsTable } from '../components';

import '../maintenance.styles.css';

const WorkOrderDetails = () => {
  const [width] = useWindowSize();

  const { redirect } = useRedirect();

  const { order, request } = useParams();

  const work_order = useGetWorkOrdersByIdQuery(getValidID(order));

  const vendor = useGetVendorsByIdQuery(getIDFromObject('vendor', work_order.data));

  const vendor_type = useGetVendorTypesByIdQuery(getIDFromObject('vendor_type', work_order.data));

  const service_request = useGetServiceRequestsByIdQuery(getIDFromObject('service_request', work_order.data));
  const unit = useGetUnitByIdQuery(getIDFromObject('unit', service_request.data));
  const property = useGetPropertyByIdQuery(getIDFromObject('property_id', service_request.data));

  const user = useGetUserByIdQuery(getIDFromObject('assign_to', work_order.data));

  const [createNewLabor, { isSuccess: isCreateLaborSuccess, isError: isCreateLaborError, error: createLaborError }] =
    useCreateWorkOrderLaborMutation();

  useResponse({
    isSuccess: isCreateLaborSuccess,
    successTitle: 'New labor has been added!',
    isError: isCreateLaborError,
    error: createLaborError,
  });

  const [updateLaborData, { isSuccess: isUpdateLaborSuccess, isError: isUpdateLaborError, error: UpdateLaborError }] =
    useUpdateWorkOrderLaborMutation();

  useResponse({
    isSuccess: isUpdateLaborSuccess,
    successTitle: 'Record has been successfully updated!',
    isError: isUpdateLaborError,
    error: UpdateLaborError,
  });

  const addLabors = async (data: ILabor) => {
    if (!isNaN(Number(order)) && Number(order) > 0) {
      return await createNewLabor({ ...data, work_order: Number(order) });
    }

    throw new Error('Order ID not found!');
  };

  const updateLabor = async (id: string | number, data: ILabor) => {
    if (!isNaN(Number(order)) && Number(order) > 0) {
      return await updateLaborData({ ...data, id, work_order: order });
    }

    throw new Error('Order ID not found!');
  };

  return (
    <ApiResponseWrapper
      {...work_order}
      renderResults={data => {
        return (
          <div className="my-3">
            <PageContainer className="mt-3">
              <BackButton />
              <h1 className="fw-bold h4 mt-1 text-uppercase">{data.slug}</h1>
              <div className="container-fluid page-section pt-3 pb-3 mt-3">
                <Card className="shadow-none border-0">
                  <Card.Body>
                    <Row className="position-relative">
                      <Col>
                        <p className="fw-bold m-0 text-primary">Work order details</p>
                        <p className="small">You can change the work order information if required</p>
                      </Col>
                      <Col xs={'auto'}>
                        <EditBtn
                          className="position-absolute top-0 end-0 m-2"
                          permission={PERMISSIONS.MAINTENANCE}
                          onClick={() => {
                            redirect(`/work-orders/${order}/modify/${request}`, false, 'work-orders');
                          }}
                        />
                      </Col>
                    </Row>
                  </Card.Body>
                  <Row className="g-lg-4 g-md-0 justify-content-between align-items-start">
                    <Col xl={width > 1440 ? 3 : 4} lg={5} md={6}>
                      <ApiResponseWrapper
                        {...unit}
                        hideIfNoResults
                        showError={false}
                        loadingComponent={<PropertySkeleton />}
                        renderResults={unit_data => (
                          <Card.Header className="border-0 pt-3 bg-transparent">
                            <ApiResponseWrapper
                              {...property}
                              hideIfNoResults
                              showError={false}
                              loadingComponent={<Skeleton xs={12} />}
                              renderResults={property_data => (
                                <Card.Title className="fw-bold text-capitalize">{property_data.name}</Card.Title>
                              )}
                            />
                            <Card.Subtitle className="small mb-3">{unit_data.name}</Card.Subtitle>
                            <Card.Img as={LazyImage} src={unit_data.cover_picture} border size="16x9" />
                          </Card.Header>
                        )}
                      />
                    </Col>
                    <Col xxl={6} lg={7} md={6}>
                      <Card.Body className="border-0 pt-3">
                        <Row className="g-sm-4">
                          <Col lg md={6} sm>
                            <ApiResponseWrapper
                              {...user}
                              showError={false}
                              hideIfNoResults
                              loadingComponent={<InformationSkeleton title skeletonType="user" />}
                              renderResults={user_data => (
                                <RenderInformation
                                  title="Assigned to"
                                  html={
                                    <Avatar
                                      name={
                                        user_data.first_name && user_data.last_name
                                          ? `${user_data.first_name} ${user_data.last_name}`
                                          : (user_data.username ?? '*')
                                      }
                                      size={30}
                                      showName
                                    />
                                  }
                                />
                              )}
                            />
                          </Col>
                          <Col lg md={6} sm>
                            <RenderInformation title="Follow up date" date={data.created_at} />
                          </Col>
                        </Row>
                        <Row className="g-sm-4">
                          <Col lg md={12} sm>
                            <div className="my-lg-3 my-1">
                              <div className="form-check">
                                <span
                                  className={clsx('form-check-input', {
                                    'checked-mark checked-mark-green': data.is_recurring,
                                  })}
                                ></span>
                                <span className="form-check-label">
                                  Recurring work order <br /> {data.get_cycle_display ?? ''}
                                </span>
                              </div>
                            </div>
                          </Col>
                          <Col lg md={12} sm>
                            <div className="my-lg-3 my-1">
                              <div className="form-check">
                                <span
                                  className={clsx('form-check-input', {
                                    'checked-mark checked-mark-green': data.owner_approved,
                                  })}
                                ></span>
                                <span className="form-check-label">Owner Approved</span>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Col>
                    <Col xs={12}>
                      <Card.Body className="pt-0">
                        <RenderInformation title="Description" description={data.job_description} />
                        <RenderInformation title="Order Type" description={data.get_order_type_display} />
                      </Card.Body>
                    </Col>
                  </Row>

                  <Row className="gx-lg-4 gy-3 gx-md-0 justify-content-between align-items-start">
                    <Col xs={12}>
                      <Card.Header className="border-top border-0 pt-4 bg-transparent text-start">
                        <p className="fw-bold m-0 text-primary">Vendor Details</p>
                        <p className="small">All information regarding the vendor for this work order</p>
                      </Card.Header>
                      <Container fluid>
                        <Row>
                          <Col lg={4} md={6} xs={12}>
                            <ApiResponseWrapper
                              {...vendor_type}
                              showError={false}
                              loadingComponent={<InformationSkeleton skeletonType="text-description" lines="single" />}
                              renderResults={vendorType => (
                                <RenderInformation
                                  title="Vendor Type"
                                  desClass="text-capitalize"
                                  description={vendorType.name}
                                />
                              )}
                            />
                          </Col>
                        </Row>
                      </Container>
                    </Col>
                    <Col md={6}>
                      <ApiResponseWrapper
                        {...vendor}
                        showError={false}
                        loadingComponent={
                          <Card.Body className="pt-0">
                            <div className="w-75 mb-sm-2 mb-3">
                              <InformationSkeleton title skeletonType="user" />
                            </div>
                            <InformationSkeleton columnCount={2} skeletonType="column" sm={4}>
                              <Skeleton xs={6} />
                            </InformationSkeleton>
                          </Card.Body>
                        }
                        renderResults={vendor_data => (
                          <Card.Body className="pt-0">
                            <RenderInformation
                              title="Vendor"
                              html={
                                <Row className="gy-0 text-muted">
                                  <Col xs={12}>
                                    <div className="mb-sm-2 mb-3">
                                      <Avatar
                                        size={30}
                                        showName
                                        name={`${vendor_data.first_name} ${vendor_data.last_name}`}
                                      />
                                    </div>
                                  </Col>
                                  {vendor_data.personal_emails && vendor_data.personal_emails.length > 0 && (
                                    <Col sm>
                                      <RenderInformation
                                        title=""
                                        desClass="mb-0"
                                        titleClass="d-none"
                                        containerMargin={false}
                                        email={vendor_data.personal_emails}
                                      />
                                    </Col>
                                  )}
                                  {vendor_data.personal_contact_numbers &&
                                    vendor_data.personal_contact_numbers.length > 0 && (
                                      <Col sm>
                                        <RenderInformation
                                          title=""
                                          desClass="mb-0"
                                          titleClass="d-none"
                                          containerMargin={false}
                                          phone={vendor_data.personal_contact_numbers}
                                        />
                                      </Col>
                                    )}
                                </Row>
                              }
                            />
                          </Card.Body>
                        )}
                      />
                    </Col>
                    <Col md={6}>
                      <Card.Body>
                        <div className="form-check">
                          <span
                            className={clsx('form-check-input', {
                              'checked-mark checked-mark-green': data.email_vendor,
                            })}
                          ></span>
                          <span className="form-check-label">Email vendor a source link to view this work order</span>
                        </div>
                        <div className="form-check">
                          <span
                            className={clsx('form-check-input', {
                              'checked-mark checked-mark-green': data.request_receipt,
                            })}
                          ></span>
                          <span className="form-check-label">Request vendor to confirm receipt of work order</span>
                        </div>
                      </Card.Body>
                    </Col>
                  </Row>

                  <Row className="gx-lg-4 gx-md-0 justify-content-between align-items-start">
                    <Col xs={12}>
                      <Card.Body className="pt-0">
                        <RenderInformation
                          title="Vendor Instructions"
                          desClass="line-break"
                          description={data.vendor_instructions}
                        />
                      </Card.Body>
                    </Col>
                  </Row>
                </Card>
              </div>

              <div className="container-fluid page-section my-4">
                <LaborDetailsTable updateLabor={updateLabor} addLabor={addLabors} />
              </div>

              <div className="container-fluid page-section my-4">
                <Card className="shadow-none border-0">
                  <Card.Header className="border-0 bg-transparent text-start">
                    <Row className="gx-0 align-items-center py-1 flex-wrap">
                      <Col>
                        <p className="fw-bold m-0 text-primary">Audit Log</p>
                      </Col>
                    </Row>
                  </Card.Header>
                  <Card.Body className="text-start p-0">
                    <Log logs={[]} />
                  </Card.Body>
                </Card>
              </div>
            </PageContainer>
          </div>
        );
      }}
    />
  );
};

export default WorkOrderDetails;
