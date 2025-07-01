import { useMemo, useState } from 'react';
import { Button, Card, Col, Form, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { Field, FieldArray, Formik, getIn } from 'formik';

import {
  useCreatePurchaseOrderAttachmentsMutation,
  useCreatePurchaseOrderItemMutation,
  useCreatePurchaseOrderMutation,
  useDeletePurchaseOrderAttachmentsMutation,
  useDeletePurchaseOrderItemMutation,
  useGetPurchaseOrderAttachmentsQuery,
  useGetPurchaseOrderItemsQuery,
  useUpdatePurchaseOrderItemMutation,
  useUpdatePurchaseOrderMutation,
} from 'services/api/purchase-orders';
import { BaseQueryError, GenericMutationResult } from 'services/api/types/rtk-query';
import { useGetVendorsByIdQuery } from 'services/api/vendors';

import { BackButton } from 'components/back-button';
import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import PageContainer from 'components/page-container';

import { AddBtn } from 'core-ui/add-another';
import { FilterPaginateInput } from 'core-ui/custom-select';
import { TrashIcon } from 'core-ui/icons/index';
import { InputDate } from 'core-ui/input-date';
import { RenderInformation } from 'core-ui/render-information';
import { Notify } from 'core-ui/toast';

import { useRedirect } from 'hooks/useRedirect';
import { useUploader } from 'hooks/useUploader';

import { PERMISSIONS } from 'constants/permissions';
import {
  formatPricing,
  getIDFromObject,
  getReadableError,
  getStringPersonName,
  isNegativeNumber,
  isPositiveNumber,
  renderFormError,
} from 'utils/functions';

import { IFileInfo } from 'interfaces/IAttachments';
import { IInventoryAPI } from 'interfaces/IInventory';
import { IPurchaseOrder, IPurchaseOrderAttachments, IPurchaseOrderItem, PriceType } from 'interfaces/IMaintenance';
import { IVendor } from 'interfaces/IPeoples';

import formFields from './form-fields';
import formValidation from './form-validation';
import SummaryDetails from './summary-details';

import './../../../maintenance.styles.css';

interface IProps {
  update?: boolean;
  purchase_order?: IPurchaseOrder;
}

declare type FormPurchaseOrder = Omit<IPurchaseOrder, 'items'> & {
  items:
    | {
        inventory_item: IInventoryAPI[];
        id?: string | number;
        inventory_item_name?: string;
        quantity?: number;
        cost?: number;
        purchase_order: number;
      }[]
    | {
        inventory_item: Option[];
        quantity: number;
      }[];
};

interface IPurchaseOrderSelectedItems {
  id?: string | number;
  inventory_item: IInventoryAPI[] | Option[];
  quantity?: number;
}

const PurchaseOrderForm = ({ purchase_order, update }: IProps) => {
  const { redirect } = useRedirect();
  const { isUploading, handleUpload, selectedFiles, ...uploadingStats } = useUploader('purchase-orders');
  const { description, required_by_date, items, vendor } = formFields;

  const [deletedFiles, setDeletedFiles] = useState<IPurchaseOrderAttachments[]>([]);
  const {
    data: purchase_order_attachments,
    isLoading: purchaseOrderAttachmentsLoading,
    isFetching: purchaseOrderAttachmentsFetching,
  } = useGetPurchaseOrderAttachmentsQuery(getIDFromObject('id', purchase_order));

  const {
    data: vendor_data,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
  } = useGetVendorsByIdQuery(getIDFromObject('vendor', purchase_order));

  const {
    data: items_data,
    isLoading: itemsLoading,
    isFetching: itemsFetching,
  } = useGetPurchaseOrderItemsQuery(getIDFromObject('id', purchase_order));

  const [show, setShow] = useState(false);
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const [createPurchaseOrder] = useCreatePurchaseOrderMutation();
  const [updatePurchaseOrder] = useUpdatePurchaseOrderMutation();

  const [createPurchaseOrderAttachment] = useCreatePurchaseOrderAttachmentsMutation();
  const [deletePurchaseOrderAttachment] = useDeletePurchaseOrderAttachmentsMutation();

  const [createPurchaseOrderItem] = useCreatePurchaseOrderItemMutation();
  const [updatePurchaseOrderItem] = useUpdatePurchaseOrderItemMutation();
  const [deletePurchaseOrderItem] = useDeletePurchaseOrderItemMutation();

  const handleFormSubmission = async (values: FormPurchaseOrder) => {
    const promises: Array<Promise<IFileInfo>> = [];
    selectedFiles.forEach(file => promises.push(handleUpload(file)));
    const attachedFiles = await Promise.all(promises);

    let record_id = purchase_order && purchase_order.id ? Number(purchase_order.id) : -1;
    const response =
      update && record_id > 0
        ? await updatePurchaseOrder({ ...values, id: record_id }).unwrap()
        : await createPurchaseOrder(values).unwrap();

    record_id = Number(response.id);
    const items = await handlePurchaseOrderItem(values.items, record_id);
    const attachments = await handleAttachments(attachedFiles, record_id);

    const failedUploads = attachments.filter(result => result.error);
    const failedUploadsItems = items.filter(result => result.error);

    await handleDeleteOldAttachments(deletedFiles);

    if (failedUploads.length <= 0 && failedUploadsItems.length <= 0) {
      return {
        data: response,
        feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
        status: 'success' as 'success' | 'warning',
      };
    }

    const feedbackMessage =
      failedUploads.length > 0
        ? `${failedUploads.length}/${selectedFiles.length} files`
        : `${failedUploadsItems.length}/${values.items.length} purchase items`;

    return {
      data: response,
      feedback: `${feedbackMessage} failed to upload. However, the record may have already been ${update ? 'updated!' : 'created!'}`,
      status: 'warning' as 'success' | 'warning',
    };
  };

  const handlePurchaseOrderItem = async (purchase_items: IPurchaseOrderSelectedItems[], purchase_id: number) => {
    const promises: Array<
      GenericMutationResult<IPurchaseOrderItem | Partial<IPurchaseOrderItem>, 'PurchaseOrderItem', IPurchaseOrderItem>
    > = [];
    const items = purchase_items as IPurchaseOrderSelectedItems[];
    if (items.length > 0) {
      items.forEach(item => {
        let parent_item_id = 0;
        if (item.inventory_item) {
          const item_selected = item.inventory_item as Array<IInventoryAPI>;
          if (item_selected && item_selected.length > 0) {
            parent_item_id = Number(item_selected[0].id);
            if (isPositiveNumber(item.id)) {
              promises.push(
                updatePurchaseOrderItem({
                  ...item,
                  purchase_order: purchase_id,
                  inventory_item: parent_item_id,
                })
              );
            } else {
              promises.push(
                createPurchaseOrderItem({
                  ...item,
                  purchase_order: purchase_id,
                  inventory_item: parent_item_id,
                })
              );
            }
          }
        }
      });
    }

    return await Promise.all(promises);
  };

  const handleAttachments = async (files: IFileInfo[], attachment__id: number) => {
    const attachments = files.map(result => ({
      name: result.name,
      file: result.unique_name,
      file_type: result.ext.toUpperCase(),
      purchase_order: attachment__id,
    })) as Array<IPurchaseOrderAttachments>;

    const promises: Array<
      GenericMutationResult<IPurchaseOrderAttachments, 'PurchaseOrdersAttachments', IPurchaseOrderAttachments>
    > = [];
    if (attachments.length > 0) {
      attachments.map(attachment => promises.push(createPurchaseOrderAttachment(attachment)));
    }

    return await Promise.all(promises);
  };

  const handleDeleteOldAttachments = async (files: IPurchaseOrderAttachments[]) => {
    const promises: Array<GenericMutationResult<IPurchaseOrderAttachments, 'PurchaseOrdersAttachments', void>> = [];
    if (files.length > 0) {
      files.map(deleted => promises.push(deletePurchaseOrderAttachment(deleted)));
    }
    await Promise.all(promises);
  };

  const charges = useMemo(() => {
    if (purchase_order) {
      const multiple_charges = {
        shipping: {
          flat: '',
          percentage: '',
          charge_type: '',
        },
      };

      if (purchase_order.shipping && purchase_order.shipping_charge_type) {
        multiple_charges.shipping = {
          charge_type: purchase_order.shipping_charge_type,
          flat: purchase_order.shipping_charge_type === 'FLAT' ? purchase_order.shipping.toString() : '',
          percentage: purchase_order.shipping_charge_type === 'PERCENT' ? purchase_order.shipping.toString() : '',
        };
      }

      return multiple_charges;
    }

    return null;
  }, [purchase_order]);

  return (
    <PageContainer className="position-relative">
      <Formik
        initialValues={{
          vendor: vendor_data ? [vendor_data] : ([] as Option[]),
          description: purchase_order?.description ?? '',
          required_by_date: purchase_order?.required_by_date ?? '',
          items: items_data
            ? items_data.map(it => ({
                ...it,
                inventory_item: [it.inventory_item] as IInventoryAPI[],
              }))
            : [
                {
                  inventory_item: [] as Option[],
                  quantity: 0,
                },
              ],
          tax: purchase_order?.tax ?? '',
          discount: purchase_order?.discount ?? '',
          tax_charge_type: 'PERCENT' as PriceType,
          shipping: purchase_order?.shipping ?? null,
          shipping_flat: charges ? (charges.shipping.flat ?? '') : '',
          shipping_percentage: charges ? (charges.shipping.percentage ?? '') : '',
          shipping_charge_type: purchase_order?.shipping_charge_type ?? ('FLAT' as PriceType),
          discount_charge_type: 'PERCENT' as PriceType,
          old_files: purchase_order_attachments ? purchase_order_attachments : ([] as IPurchaseOrderAttachments[]),
          files: [] as File[],
          notes: '',
        }}
        validationSchema={formValidation}
        enableReinitialize
        onSubmit={(values, { setSubmitting, setFieldError }) => {
          let vendor_id = 0;
          if (values.vendor && values.vendor.length > 0) {
            vendor_id = Number((values.vendor as Array<IVendor>)[0].id);
          }

          const data: FormPurchaseOrder = {
            ...values,
            vendor: vendor_id,
            tax_charge_type: !values.tax ? null : values.tax_charge_type,
            tax: values.tax ? Number(values.tax) : undefined,
            discount_charge_type: !values.discount ? null : values.discount_charge_type,
            discount: values.discount ? Number(values.discount) : undefined,
            shipping_charge_type: !values.shipping ? null : values.shipping_charge_type,
            shipping: values.shipping ? Number(values.shipping) : undefined,
          };

          handleFormSubmission(data)
            .then(result => {
              Notify.show({ type: result.status, title: result.feedback });
              redirect(`/purchase-orders/details/${result.data.id}`, true, 'purchase-orders');
            })
            .catch(err => {
              Notify.show({ type: 'danger', title: 'Something went wrong!', description: getReadableError(err) });
              const error = err as BaseQueryError;
              if (error.status === 400 && error.data) {
                renderFormError(error.data, setFieldError);
              }
            })
            .finally(() => {
              setSubmitting(false);
            });
        }}
      >
        {({ errors, touched, values, handleBlur, setFieldTouched, setFieldValue, handleChange, handleSubmit }) => (
          <Form className="text-start" noValidate onSubmit={handleSubmit}>
            <Stack direction="horizontal" className="gx-0 gy-3 align-items-stretch">
              <div className="me-xxl-3 me-2 w-100">
                <Stack className="justify-content-between align-items-end" direction="horizontal">
                  <div>
                    <BackButton />
                    <h1 className="fw-bold h4 mt-1">{update ? 'Update Purchase Order' : 'New Purchase Order'}</h1>
                    gi{' '}
                  </div>
                  <Button size="sm" variant="secondary" className="d-lg-none d-inline-block" onClick={handleShow}>
                    Open Summary
                  </Button>
                </Stack>

                <Card className="border-0 shadow-none bg-transparent mb-3">
                  <Card.Body className="p-0 mt-4">
                    <Row className="gx-sm-4 gx-0 align-items-start justify-content-between">
                      <Col sm={6}>
                        <FilterPaginateInput
                          name={vendor.name}
                          labelText={'Select Vendor'}
                          placeholder={`Search for vendor`}
                          controlId={`PurchaseOrderFormVendor`}
                          classNames={{
                            labelClass: 'popup-form-labels',
                            wrapperClass: 'mb-3',
                          }}
                          selected={values.vendor}
                          onSelectChange={selected => {
                            if (selected.length) {
                              setFieldValue(vendor.name, selected);
                            } else {
                              setFieldValue(vendor.name, []);
                            }
                          }}
                          onBlurChange={() => setFieldTouched(vendor.name, true)}
                          isValid={touched.vendor && !errors.vendor}
                          isInvalid={touched.vendor && !!errors.vendor}
                          filterBy={['first_name', 'last_name']}
                          inputProps={{
                            style: {
                              paddingLeft: values.vendor.length > 0 ? `2.5rem` : '',
                            },
                          }}
                          labelKey={option => getStringPersonName(option as IVendor)}
                          renderMenuItemChildren={option => <ItemMenuItem option={option as IVendor} />}
                          renderInput={(inputProps, { selected }) => {
                            const option = selected.length > 0 ? (selected[0] as IVendor) : undefined;
                            return <ItemInputItem {...inputProps} option={option} />;
                          }}
                          model_label="people.Vendor"
                          disabled={vendorLoading || vendorFetching}
                          error={errors.vendor}
                        />
                      </Col>
                      <Col sm={8} lg={7}>
                        <Form.Group className="mb-4" controlId="PurchaseOrderFormDescription">
                          <Form.Label className="form-label-md">Vendor Instructions</Form.Label>
                          <Form.Control
                            rows={4}
                            as="textarea"
                            placeholder="Some text here"
                            name={description.name}
                            value={values.description}
                            onChange={handleChange}
                            onBlur={handleBlur}
                            isValid={touched.description && !errors.description}
                            isInvalid={touched.description && !!errors.description}
                          />
                          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
                        </Form.Group>
                      </Col>
                      <Col sm={4} md={5} xxl={3}>
                        <InputDate
                          minDate={new Date()}
                          name={required_by_date.name}
                          labelText={'Required by date'}
                          controlId="PurchaseOrderFormRequiredDate"
                          value={values.required_by_date}
                          classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
                          onDateSelection={date => setFieldValue(required_by_date.name, date)}
                          onBlur={() => setFieldTouched(required_by_date.name)}
                          isValid={touched.required_by_date && !errors.required_by_date}
                          isInvalid={touched.required_by_date && !!errors.required_by_date}
                          error={errors.required_by_date}
                        />
                      </Col>
                    </Row>

                    <p className="fw-bold m-0 text-primary">Item details</p>
                    <p className="small">Add items to the purchase order</p>
                    {values.items.length <= 0 && (
                      <Form.Text className="text-danger">{errors.items?.toString()}</Form.Text>
                    )}

                    <FieldArray
                      name={items.name}
                      render={arrayHelpers => (
                        <div
                          className={clsx({ disabled: itemsLoading || itemsFetching })}
                          aria-disabled={itemsLoading || itemsFetching}
                        >
                          <div className="mb-4">
                            {values.items &&
                              values.items.map((_, index) => {
                                const itemFieldName = `items[${index}].inventory_item`;
                                const itemQuantityFieldName = `items[${index}].quantity`;
                                const { cost, line_total, discount, tax } = getCostPlusLineTotal(
                                  _.inventory_item,
                                  _.quantity,
                                  values.tax,
                                  values.discount
                                );

                                return (
                                  <Card key={index} className="p-0 mb-4 position-relative page-section border-0">
                                    <Card.Body className="p-0">
                                      <Stack direction="horizontal">
                                        <Card.Body className="px-2 pb-0 col-md col-sm-10 col-8">
                                          <Row className="gx-2 gy-0 align-items-start justify-content-evenly flex-nowrap overflow-auto">
                                            <Col xs={8} sm={6} md={5} xxl={4}>
                                              <FilterPaginateInput
                                                name={itemFieldName}
                                                labelText={'Inventory Item'}
                                                placeholder={`Select inventory item`}
                                                controlId={itemFieldName}
                                                className="small"
                                                classNames={{
                                                  labelClass: 'form-label-sm',
                                                  wrapperClass: 'mb-2',
                                                }}
                                                selected={_.inventory_item as Option[]}
                                                onSelectChange={selected => {
                                                  if (selected.length) {
                                                    setFieldValue(itemFieldName, selected);
                                                  } else {
                                                    setFieldValue(itemFieldName, []);
                                                  }
                                                }}
                                                size="sm"
                                                onBlurChange={() => setFieldTouched(itemFieldName, true)}
                                                isInvalid={Boolean(
                                                  !!getIn(errors, itemFieldName) && getIn(touched, itemFieldName)
                                                )}
                                                isValid={Boolean(
                                                  getIn(touched, itemFieldName) && !getIn(errors, itemFieldName)
                                                )}
                                                labelKey={`name`}
                                                filterBy={(option, { text }) => {
                                                  const selected = option as IInventoryAPI;
                                                  const prev =
                                                    _.inventory_item.length > 0
                                                      ? (_.inventory_item[0] as IInventoryAPI)
                                                      : null;
                                                  const items = values.items as {
                                                    inventory_item: IInventoryAPI[] | Option[];
                                                    quantity?: number;
                                                  }[];

                                                  const isExist = items.find(item => {
                                                    return (item.inventory_item as IInventoryAPI[]).find(inv => {
                                                      return selected.name.toLowerCase() === inv.name.toLowerCase();
                                                    });
                                                  });

                                                  if (isExist && !prev) return false;
                                                  return selected.name.toLowerCase().indexOf(text.toLowerCase()) !== -1;
                                                }}
                                                renderMenuItemChildren={(option: Option) => {
                                                  const inv = option as IInventoryAPI;
                                                  return (
                                                    <div className="text-wrap small">
                                                      <div className="fw-bold text-uppercase">{inv.name}</div>
                                                      <Stack
                                                        direction="horizontal"
                                                        gap={1}
                                                        className="text-truncate small"
                                                      >
                                                        <span
                                                          className={clsx(
                                                            {
                                                              '-ive': isNegativeNumber(inv.cost),
                                                            },
                                                            'price-symbol'
                                                          )}
                                                        >
                                                          {formatPricing(inv.cost)}
                                                        </span>
                                                        <span className="vr"></span>
                                                        <span className="mx-1">Q: {inv.quantity}</span>
                                                      </Stack>
                                                    </div>
                                                  );
                                                }}
                                                useCache={false}
                                                model_label="maintenance.Inventory"
                                              />
                                            </Col>
                                            <Col xxl={2} xs={3}>
                                              <Form.Group controlId={itemQuantityFieldName} className="mb-2">
                                                <Form.Label className="form-label-sm">Quantity</Form.Label>
                                                <Field
                                                  size="sm"
                                                  as={Form.Control}
                                                  name={itemQuantityFieldName}
                                                  className="small"
                                                  isInvalid={
                                                    !!getIn(errors, itemQuantityFieldName) &&
                                                    getIn(touched, itemQuantityFieldName)
                                                  }
                                                  isValid={
                                                    getIn(touched, itemQuantityFieldName) &&
                                                    !getIn(errors, itemQuantityFieldName)
                                                  }
                                                  disabled={_.inventory_item.length <= 0 || !_.inventory_item}
                                                  placeholder="0.00"
                                                  type="number"
                                                />
                                              </Form.Group>
                                            </Col>
                                            <Col xs="auto">
                                              <RenderInformation
                                                title="Cost"
                                                containerClass="mx-2"
                                                titleClass="mb-2 d-inline-block form-label-sm"
                                                desClass="form-control-sm mb-2 price-symbol"
                                                containerMargin={false}
                                                description={cost}
                                              />
                                            </Col>
                                            <Col xs="auto" data-line={line_total}>
                                              <RenderInformation
                                                title="Line Total"
                                                containerClass="mx-2"
                                                titleClass="mb-2 d-inline-block form-label-sm"
                                                desClass="form-control-sm mb-2 purchase-line-total price-symbol"
                                                containerMargin={false}
                                                description={line_total}
                                              />
                                            </Col>
                                            <Col xs="auto" data-line={values.tax}>
                                              <RenderInformation
                                                title="Tax"
                                                containerClass="mx-2"
                                                titleClass="mb-2 d-inline-block form-label-sm"
                                                desClass="form-control-sm mb-2 price-symbol"
                                                containerMargin={false}
                                                description={tax}
                                              />
                                            </Col>
                                            <Col xs="auto" data-line={values.discount}>
                                              <RenderInformation
                                                title="Discount"
                                                containerClass="mx-2"
                                                titleClass="mb-2 d-inline-block form-label-sm"
                                                desClass="form-control-sm mb-2 price-symbol"
                                                containerMargin={false}
                                                description={discount}
                                              />
                                            </Col>
                                          </Row>
                                        </Card.Body>
                                        <Button
                                          size="sm"
                                          variant="link"
                                          className="col text-center text-decoration-none bg-dark link-primary bg-opacity-10 align-self-stretch py-2 px-3 shadow-none"
                                          onClick={() => {
                                            arrayHelpers.remove(index);
                                            if ('id' in _) {
                                              _.id && deletePurchaseOrderItem(_.id);
                                            }
                                          }}
                                        >
                                          <TrashIcon size="22" color="#737373" />
                                          <p className="small text-black-25 mt-1 mb-0">Remove</p>
                                        </Button>
                                      </Stack>
                                    </Card.Body>
                                  </Card>
                                );
                              })}
                          </div>

                          <div className="text-center">
                            <AddBtn
                              permission={PERMISSIONS.MAINTENANCE}
                              onClick={() =>
                                arrayHelpers.push({
                                  [items.inventory_item.name]: [] as Option[],
                                  [items.quantity.name]: 0,
                                })
                              }
                            />
                          </div>
                        </div>
                      )}
                    />
                  </Card.Body>
                </Card>
              </div>
              <SummaryDetails
                {...uploadingStats}
                items={values.items}
                setDeletedFiles={setDeletedFiles}
                loadingAttachments={purchaseOrderAttachmentsFetching || purchaseOrderAttachmentsLoading || isUploading}
                handleClose={handleClose}
                update={update ?? false}
                show={show}
              />
            </Stack>
          </Form>
        )}
      </Formik>
    </PageContainer>
  );
};

const getCostPlusLineTotal = (
  item?: number | Option[] | IInventoryAPI,
  quantity?: number | string,
  tax?: number | string,
  discount?: number | string
) => {
  if (typeof item === 'string' || typeof item === 'number' || !item) return { cost: '0', line_total: '0' };

  const qty = !quantity || isNaN(Number(quantity)) || Number(quantity) <= 0 ? 0 : Number(quantity);

  const tx = !tax || isNaN(Number(tax)) || Number(tax) <= 0 ? 0 : Number(tax);
  const dis = !discount || isNaN(Number(discount)) || Number(discount) <= 0 ? 0 : Number(discount);

  let selected: IInventoryAPI | null = null;
  if (!Array.isArray(item) && item && 'cost' in item && 'quantity' in item) {
    selected = item;
  }

  if (Array.isArray(item) && item.length > 0) {
    selected = (item as IInventoryAPI[])[0];
  }

  if (selected && selected.cost) {
    const cost = Number(selected.cost);
    console.log(tx, dis, cost);
    return {
      cost: cost.toString(),
      line_total: (cost * Number(qty)).toFixed(2),
      tax: ((Number(tx) / 100) * Number(cost * Number(qty))).toFixed(2),
      discount: ((Number(dis) / 100) * Number(cost * Number(qty))).toFixed(2),
    };
  }

  return { cost: '0', line_total: '0', tax: '0', discount: '0' };
};

export default PurchaseOrderForm;
