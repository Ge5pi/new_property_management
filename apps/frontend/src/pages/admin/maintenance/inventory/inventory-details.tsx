import { Card, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import { useGetInventoryByIdQuery } from 'services/api/inventory';
import { useGetVendorsByIdQuery } from 'services/api/vendors';

import { BackButton } from 'components/back-button';
import PageContainer from 'components/page-container';
import { InformationSkeleton } from 'components/skeleton';

import { RenderInformation } from 'core-ui/render-information';
import { Avatar } from 'core-ui/user-avatar';

import { getIDFromObject, getValidID } from 'utils/functions';

import '../maintenance.styles.css';

const InventoryDetails = () => {
  const { inventory: inventory_id } = useParams();

  const inventory = useGetInventoryByIdQuery(getValidID(inventory_id));
  const vendor = useGetVendorsByIdQuery(getIDFromObject('vendor', inventory.data));

  return (
    <ApiResponseWrapper
      {...inventory}
      renderResults={data => {
        return (
          <div className="my-3">
            <PageContainer className="mt-3">
              <BackButton />
              <h1 className="fw-bold h4 mt-1">{data.name}</h1>
              <div className="container-fluid page-section pt-3 pb-3 mt-3">
                <Card className="shadow-none border-0">
                  <Card.Body className="pb-0">
                    <Row className="gx-lg-4 gx-md-0 gy-md-0 justify-content-between align-items-stretch">
                      <Col sm={6}>
                        <Row>
                          <Col xs={12}>
                            <p className="fw-bold m-0 text-primary">Item Details</p>
                            <p className="small">Basic Information of this item</p>
                          </Col>
                          <Col sm={6}>
                            <RenderInformation title="Item Name" description={data.name} />
                          </Col>
                          <Col sm={6}>
                            <RenderInformation title="Item Type" description={data.item_type_name} />
                          </Col>
                          <Col xs={12}>
                            <RenderInformation title="Description" description={data.description} />
                          </Col>
                          <Col xs={12}>
                            <RenderInformation title="Quantity" description={data.quantity} />
                          </Col>
                          <Col xs={12}>
                            <ApiResponseWrapper
                              {...vendor}
                              hideIfNoResults
                              loadingComponent={
                                <div className="col-xl-6 col-md-8 col-12">
                                  <InformationSkeleton title size="sm" skeletonType="user" />
                                </div>
                              }
                              showError={false}
                              renderResults={vendor_data => (
                                <RenderInformation
                                  title="Vendor"
                                  html={
                                    <Avatar
                                      size={30}
                                      name={`${vendor_data.first_name} ${vendor_data.last_name}`}
                                      showName={true}
                                    />
                                  }
                                />
                              )}
                            />
                          </Col>
                        </Row>
                      </Col>
                      <Col xs={'auto'} className="d-none d-sm-block">
                        <div className="vr h-100"></div>
                      </Col>
                      <Col sm={5}>
                        <Row>
                          <Col xs={12}>
                            <p className="fw-bold m-0 text-primary">Account Details</p>
                            <p className="small">Showing account details of this Item</p>
                          </Col>
                          <Col xs={12}>
                            <RenderInformation title="Expense Account" description={data.expense_account} />
                          </Col>
                          <Col lg sm={6}>
                            <RenderInformation title="Cost price" description={data.cost} desClass="price-symbol" />
                          </Col>
                        </Row>
                      </Col>
                    </Row>
                  </Card.Body>
                  <hr className="m-0" />
                  <Card.Body>
                    <Row className="gx-lg-4 gx-md-0 gy-md-0 justify-content-between align-items-start">
                      <Col xs={12}>
                        <p className="fw-bold m-0 text-primary">Location Details</p>
                        <p className="small">Location information for this item</p>
                      </Col>
                      <Col xs={12}>
                        <RenderInformation title="Location" description={data.location_name} />
                      </Col>
                      <Col xs={12}>
                        <RenderInformation title="Bin / Shelf Number" description={data.bin_or_shelf_number} />
                      </Col>
                    </Row>
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

export default InventoryDetails;
