import { Card, Col, ListGroup, Row, Stack } from 'react-bootstrap';
import { useParams } from 'react-router-dom';

import { clsx } from 'clsx';

import { ApiResponseWrapper } from 'components/api-response-wrapper';
import useResponse from 'services/api/hooks/useResponse';
import {
  useCreatePurchaseOrderAttachmentsMutation,
  useDeletePurchaseOrderAttachmentsMutation,
  useGetPurchaseOrderAttachmentsQuery,
  useGetPurchaseOrderByIdQuery,
  useGetPurchaseOrderItemsQuery,
  useUpdatePurchaseOrderMutation,
} from 'services/api/purchase-orders';

import { Attachments } from 'components/attachments';
import { BackButton } from 'components/back-button';
import { ItemPrice } from 'components/custom-cell';
import { Log } from 'components/log';
import { Notes } from 'components/notes';
import PageContainer from 'components/page-container';
import { SimpleTable } from 'components/table';

import { EditBtn } from 'core-ui/edit-button';
import { RenderInformation } from 'core-ui/render-information';

import { useRedirect } from 'hooks/useRedirect';

import { PERMISSIONS } from 'constants/permissions';
import { formatPricing, getValidID, isNegativeNumber, isPositiveNumber } from 'utils/functions';

import { IAttachments } from 'interfaces/IAttachments';
import { IPurchaseOrderAttachments } from 'interfaces/IMaintenance';

import './../../../maintenance.styles.css';

const PurchaseOrdersDetails = () => {
  const { purchase: purchase_id } = useParams();
  const { redirect } = useRedirect();

  const purchase_order = useGetPurchaseOrderByIdQuery(getValidID(purchase_id));
  const { data: items = [], ...purchase_order_items } = useGetPurchaseOrderItemsQuery(getValidID(purchase_id));
  const purchase_order_attachments = useGetPurchaseOrderAttachmentsQuery(getValidID(purchase_id));

  const [
    updatePurchaseOrder,
    { isSuccess: isUpdatePurchaseOrderSuccess, isError: isUpdatePurchaseOrderError, error: updatePurchaseOrderError },
  ] = useUpdatePurchaseOrderMutation();

  useResponse({
    isSuccess: isUpdatePurchaseOrderSuccess,
    successTitle: 'Purchase Order Note updated',
    isError: isUpdatePurchaseOrderError,
    error: updatePurchaseOrderError,
  });

  const handleNoteSubmit = async (value: string) => {
    if (isPositiveNumber(purchase_id)) {
      updatePurchaseOrder({ notes: value, id: Number(purchase_id) });
    }
  };

  // create attachment
  const [
    createPurchaseOrderAttachments,
    { isSuccess: isCreateAttachmentSuccess, isError: isCreateAttachmentError, error: isAttachmentError },
  ] = useCreatePurchaseOrderAttachmentsMutation();
  useResponse({
    isSuccess: isCreateAttachmentSuccess,
    successTitle: 'Your file has been successfully uploaded!',
    isError: isCreateAttachmentError,
    error: isAttachmentError,
  });

  const [
    deletePurchaseOrderAttachments,
    { isSuccess: isDeleteAttachmentSuccess, isError: isDeleteAttachmentError, error: deleteAttachmentError },
  ] = useDeletePurchaseOrderAttachmentsMutation();

  useResponse({
    isSuccess: isDeleteAttachmentSuccess,
    successTitle: 'Your file has been successfully deleted!',
    isError: isDeleteAttachmentError,
    error: deleteAttachmentError,
  });

  const handleAttachmentDelete = async (row: object) => {
    const attachment = row as IPurchaseOrderAttachments;
    if (attachment.id && attachment.purchase_order) {
      await deletePurchaseOrderAttachments(attachment);
      return Promise.resolve('delete successful');
    }

    return Promise.reject('Incomplete data found');
  };

  const handleAttachmentUpload = async (data: IAttachments) => {
    if (isPositiveNumber(purchase_id)) {
      const id = Number(purchase_id);
      return await createPurchaseOrderAttachments({ ...data, purchase_order: id });
    }
    return Promise.reject('Incomplete data found');
  };

  const columns = [
    {
      Header: 'Item',
      accessor: 'inventory_item_name',
      disableSortBy: true,
    },
    {
      Header: 'Quantity',
      accessor: 'quantity',
      disableSortBy: true,
    },
    {
      Header: 'Item',
      accessor: 'cost',
      Cell: ItemPrice,
      disableSortBy: true,
    },
    {
      Header: 'Line Total',
      accessor: 'item_cost',
      Cell: ItemPrice,
      disableSortBy: true,
    },
    {
      Header: 'Tax',
      accessor: 'tax_value',
      Cell: ItemPrice,
      disableSortBy: true,
    },
    {
      Header: 'Discount',
      accessor: 'discount_value',
      Cell: ItemPrice,
      disableSortBy: true,
    },
  ];

  return (
    <ApiResponseWrapper
      {...purchase_order}
      renderResults={data => {
        return (
          <PageContainer className="component-margin-y">
            <div className="my-3">
              <Stack className="justify-content-between" direction="horizontal">
                <div>
                  <BackButton />
                  <h1 className="fw-bold h4 mt-1">Purchase Order Details</h1>
                </div>
              </Stack>
            </div>
            {/* General details */}
            <Card className="border-0 p-0 page-section my-3">
              <Card.Header className="border-0 px-4 pt-4 mb-4 bg-transparent text-start">
                <Stack className="justify-content-between" direction="horizontal">
                  <div>
                    <p className="fw-bold m-0 text-primary text-uppercase">{data.slug}</p>
                    <RenderInformation
                      date={data.required_by_date}
                      containerMargin={false}
                      titleClass="d-none"
                      title=""
                      dateClass="flex-row-reverse"
                    />
                  </div>
                  <EditBtn
                    permission={PERMISSIONS.MAINTENANCE}
                    onClick={() => redirect(`/purchase-orders/modify/${purchase_id}`, false, 'purchase-orders')}
                  />
                </Stack>
              </Card.Header>
              <Card.Body className="p-0">
                <div className="px-4">
                  <Row className="gx-3 gy-4">
                    <Col lg={3} md={4} sm={6}>
                      <RenderInformation
                        title="Vendor"
                        description={`${data.vendor_first_name} ${data.vendor_last_name}`}
                      />
                    </Col>
                    <Col lg={3} md={4} sm={6}>
                      <RenderInformation
                        title="Vendor Instructions"
                        desClass="line-break"
                        description={data.description}
                      />
                    </Col>
                  </Row>

                  <Row className="gx-3 gy-3">
                    <Col lg={3} md={4} sm={6}>
                      <RenderInformation title="Total Amount" desClass="price-symbol" description={data.total} />
                    </Col>
                  </Row>
                </div>

                <hr />

                <div className="p-4">
                  <p className="fw-bold m-0 text-primary">Item details</p>
                  <p className="m-0 text-primary small mb-4">List of items included in this purchase order</p>

                  <SimpleTable
                    {...purchase_order_items}
                    hideMainHeaderComponent
                    wrapperClass="detail-section-table"
                    newRecordButtonPermission={PERMISSIONS.MAINTENANCE}
                    showTotal={false}
                    data={items}
                    columns={columns}
                    shadow={false}
                  />

                  <Row className="justify-content-end">
                    <Col lg={4}>
                      <ListGroup className="mt-4">
                        <ListGroup.Item className="px-3">
                          <div className="m-0">
                            <p className="fw-bold m-0 text-primary">Summary</p>

                            <Stack className="justify-content-between mt-3" direction="horizontal">
                              <p className="m-0 small fw-medium">Subtotal</p>
                              <p
                                className={clsx(
                                  {
                                    '-ive': isNegativeNumber(data.sub_total),
                                  },
                                  'm-0 small fw-medium price-symbol'
                                )}
                              >
                                {formatPricing(data.sub_total)}
                              </p>
                            </Stack>
                          </div>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-3">
                          <Stack className="justify-content-between" direction="horizontal">
                            <p className="m-0 small fw-medium">Tax estimate</p>
                            <p className="small fw-medium mb-0 percentage-symbol me-2">{Number(data.tax).toFixed(2)}</p>
                          </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-3">
                          <Stack className="justify-content-between" direction="horizontal">
                            <p className="m-0 small fw-medium">Shipping estimate</p>
                            <p
                              className={clsx(
                                { 'price-symbol': data.shipping_charge_type === 'FLAT' },
                                { '-ive': data.shipping_charge_type === 'FLAT' && isNegativeNumber(data.shipping) },
                                { 'percentage-symbol me-2': data.shipping_charge_type === 'PERCENT' },
                                'm-0 small fw-medium'
                              )}
                            >
                              {formatPricing(data.shipping)}
                            </p>
                          </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-3">
                          <Stack className="justify-content-between" direction="horizontal">
                            <p className="m-0 small fw-medium">Discount</p>
                            <p className="small fw-medium mb-0 percentage-symbol me-2">
                              {Number(data.discount).toFixed(2)}
                            </p>
                          </Stack>
                        </ListGroup.Item>
                        <ListGroup.Item className="px-3">
                          <Stack className="justify-content-between" direction="horizontal">
                            <p className="m-0 small fw-medium">Total</p>
                            <p
                              className={clsx(
                                {
                                  '-ive': isNegativeNumber(data.total),
                                },
                                'm-0 small fw-medium price-symbol'
                              )}
                            >
                              {formatPricing(data.total)}
                            </p>
                          </Stack>
                        </ListGroup.Item>
                      </ListGroup>
                    </Col>
                  </Row>
                </div>
              </Card.Body>
            </Card>

            <div className="container-fluid page-section my-4">
              <Row className="mt-1 g-0 align-items-stretch">
                <Col xs={12}>
                  <Card className="border-0">
                    <Card.Header className="border-0 px-2 py-3 bg-transparent text-start">
                      <p className="fw-bold m-0 text-primary">Notes</p>
                      <span className="small text-muted">
                        Write down all relevant information and quick notes for your help over here
                      </span>
                    </Card.Header>
                    <Card.Body className="px-2 text-start pt-0 pb-4">
                      <Notes
                        initialValue={data.notes}
                        onNoteSubmit={handleNoteSubmit}
                        controlID={'PurchaseOrderNoteInput'}
                        label={'Notes'}
                      />
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </div>

            <div className="page-section my-4">
              <Attachments
                {...purchase_order_attachments}
                uploadPermission={PERMISSIONS.MAINTENANCE}
                deletePermission={PERMISSIONS.MAINTENANCE}
                onDelete={handleAttachmentDelete}
                onUpload={handleAttachmentUpload}
                uploadInfo={{ module: 'purchase-orders', folder: 'attachments' }}
              />
            </div>

            <div className="page-section my-4">
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
        );
      }}
    />
  );
};

export default PurchaseOrdersDetails;
