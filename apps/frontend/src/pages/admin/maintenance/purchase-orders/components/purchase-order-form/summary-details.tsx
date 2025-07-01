import { Dispatch, SetStateAction, useCallback, useEffect, useMemo } from 'react';
import { Button, Card, CloseButton, Col, Form, ListGroup, Row, Stack } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormikContext } from 'formik';

import { Dropzone } from 'components/dropzone';
import { FileAttachments } from 'components/file-attachments';
import { SubmitBtn } from 'components/submit-button';

import { GroupedField } from 'core-ui/grouped-field';

import { useRedirect } from 'hooks/useRedirect';
import { useWindowSize } from 'hooks/useWindowSize';

import { FILE_ALL_TYPES } from 'constants/file-types';
import { formatPricing, isNegativeNumber } from 'utils/functions';

import { IFileInfo, IUploadProgress } from 'interfaces/IAttachments';
import { IInventoryAPI } from 'interfaces/IInventory';
import { IPurchaseOrder, IPurchaseOrderAttachments } from 'interfaces/IMaintenance';

import formFields from './form-fields';

interface PurchaseOrderFormValues extends IPurchaseOrder {
  shipping_flat: string;
  shipping_percentage: string;
  old_files: IPurchaseOrderAttachments[];
  files: File[];
}

declare type ItemType =
  | {
      inventory_item: IInventoryAPI[];
      id?: string | number | undefined;
      inventory_item_name?: string | undefined;
      quantity?: number | undefined;
      purchase_order: number;
    }
  | {
      inventory_item: IInventoryAPI[] | Option[];
      quantity: number;
    };
interface IProps {
  items: ItemType[];
  update: boolean;
  show?: boolean;
  handleClose?: () => void;
  loadingAttachments?: boolean;
  setTotalFiles: Dispatch<SetStateAction<number>>;
  setDeletedFiles: Dispatch<SetStateAction<IPurchaseOrderAttachments[]>>;
  progress: IUploadProgress[];
  filesData: IFileInfo[];
}

const SummaryDetails = ({
  items,
  update,
  show,
  handleClose,
  filesData,
  progress,
  setDeletedFiles,
  setTotalFiles,
  loadingAttachments,
}: IProps) => {
  const { redirect } = useRedirect();
  const [width] = useWindowSize();
  const { touched, errors, values, isSubmitting, setFieldValue, setFieldError, handleBlur, handleChange } =
    useFormikContext<PurchaseOrderFormValues>();

  const { tax, discount, notes, shipping_charge_type, shipping_flat, shipping_percentage } = formFields;

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      if (acceptedFiles.length) {
        let aFiles = acceptedFiles;
        if (values.files && Array.isArray(values.files)) {
          const initialValue = values.files as File[];
          aFiles = [...aFiles, ...initialValue];
          aFiles = aFiles.filter((value, index, self) => index === self.findIndex(t => t.name === value.name));
        }

        setFieldValue('files', aFiles);
        setTotalFiles(prev => prev + acceptedFiles.length);
      }
    },
    [setTotalFiles, setFieldValue, values.files]
  );

  const handleFileRemoval = (file: IPurchaseOrderAttachments, old_files: IPurchaseOrderAttachments[]) => {
    const _files = old_files.filter(value => {
      if (value.name === file.name) {
        setDeletedFiles(prev => [...prev, file]);
      }
      return value.name !== file.name;
    });

    setFieldValue('old_files', _files);
  };

  const subtotal = useMemo(() => {
    if (items.length) {
      const _subtotal = items.reduce((a, b: ItemType) => {
        if (b.inventory_item && b.inventory_item.length) {
          return a + Number((b.inventory_item[0] as IInventoryAPI).cost) * Number(b.quantity ?? 0);
        }
        return a;
      }, 0);
      return _subtotal;
    }

    return 0;
  }, [items]);

  const shipping = useMemo(() => {
    let className = 'price-symbol';
    let value = formatPricing(values.shipping_flat);
    if (!values.shipping_percentage && isNegativeNumber(values.shipping_flat)) {
      className += ' -ive';
    }

    if (values.shipping_percentage) {
      value = Number(values.shipping_percentage).toFixed(2);
      className = 'percentage-symbol pe-3';
    }

    return { value, className };
  }, [values.shipping_flat, values.shipping_percentage]);

  const total = useMemo(() => {
    const tax = (Number(values.tax ?? 0) / 100) * subtotal;
    const shipping =
      values.shipping_charge_type === 'PERCENT'
        ? (Number(values.shipping_percentage ?? 0) / 100) * subtotal
        : Number(values.shipping_flat ?? 0);
    const discount = (Number(values.discount ?? 0) / 100) * subtotal;
    return (tax + shipping + subtotal - discount).toFixed(2);
  }, [
    values.tax,
    values.discount,
    values.shipping_flat,
    values.shipping_percentage,
    values.shipping_charge_type,
    subtotal,
  ]);

  useEffect(() => {
    if (width < 992 && show) {
      document.body.classList.add('overflow-hidden');
    } else {
      document.body.classList.remove('overflow-hidden');
    }
  }, [width, show]);

  return (
    <div>
      <div
        className={clsx('page-section border', { 'summary-details': width < 992 }, { show: show && width < 992 })}
        style={{ width: show && width < 992 ? (width < 425 ? '100%' : 340) : undefined }}
      >
        <Stack className="align-items-stretch justify-content-between g-0">
          <div className="flex-grow-0">
            <Card.Header className="bg-white p-3">
              <Stack direction="horizontal" gap={2} className="justify-content-between">
                <div>
                  <p className="fw-bold m-0 mt-2 text-primary">Summary details</p>
                  <p className="m-0 text-primary small">You can view the order summary</p>
                </div>
                {width < 992 && show && <CloseButton onClick={handleClose} />}
              </Stack>
            </Card.Header>
          </div>
          <div className="flex-fill overflow-auto">
            <div>
              <Card.Body className="p-3">
                <Form.Group controlId="PurchaseOrderFormTax" className="mb-3">
                  <div className="form-label-md">Include Tax</div>
                  <Stack direction="horizontal" gap={2}>
                    <GroupedField
                      icon="%"
                      size="sm"
                      position="end"
                      wrapperClass="m-0"
                      type="number"
                      value={values.tax}
                      controlId="PurchaseOrderFormTaxPercentage"
                      name={tax.name}
                      error={errors.tax}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isValid={touched.tax && !errors.tax}
                      isInvalid={touched.tax && !!errors.tax}
                    />
                  </Stack>
                </Form.Group>

                <Form.Group controlId="PurchaseOrderFormShipping" className="mb-3">
                  <div className="form-label-md">Include Shipping</div>
                  <Stack direction="horizontal" gap={2}>
                    <GroupedField
                      icon="$"
                      size="sm"
                      position="end"
                      type="number"
                      value={values.shipping_flat}
                      controlId="PurchaseOrderFormShippingFlat"
                      name={shipping_flat.name}
                      error={errors.shipping_flat}
                      wrapperClass="m-0"
                      onChange={ev => {
                        if (values.shipping_percentage) {
                          setFieldValue(shipping_percentage.name, '');
                        }

                        setFieldValue(shipping_charge_type.name, 'FLAT');
                        setFieldValue('shipping', ev.target.value);
                        handleChange(ev);
                      }}
                      onBlur={handleBlur}
                      isValid={touched.shipping_flat && !errors.shipping_flat}
                      isInvalid={touched.shipping_flat && !!errors.shipping_flat}
                      disabled={Boolean(values.shipping_percentage.toString().length)}
                      readOnly={Boolean(values.shipping_percentage.toString().length)}
                    />
                    <GroupedField
                      icon="%"
                      size="sm"
                      position="end"
                      wrapperClass="m-0"
                      type="number"
                      value={values.shipping_percentage}
                      controlId="PurchaseOrderFormShippingPercentage"
                      name={shipping_percentage.name}
                      error={errors.shipping_percentage}
                      onChange={ev => {
                        if (values.shipping_flat) {
                          setFieldValue(shipping_flat.name, '');
                        }

                        setFieldValue(shipping_charge_type.name, 'PERCENT');
                        setFieldValue('shipping', ev.target.value);
                        handleChange(ev);
                      }}
                      onBlur={handleBlur}
                      isValid={touched.shipping_percentage && !errors.shipping_percentage}
                      isInvalid={touched.shipping_percentage && !!errors.shipping_percentage}
                      disabled={Boolean(values.shipping_flat.toString().length)}
                      readOnly={Boolean(values.shipping_flat.toString().length)}
                    />
                  </Stack>
                </Form.Group>

                <Form.Group controlId="PurchaseOrderFormDiscount" className="mb-3">
                  <div className="form-label-md">Discount</div>
                  <Stack direction="horizontal" gap={2}>
                    <GroupedField
                      icon="%"
                      size="sm"
                      position="end"
                      wrapperClass="m-0"
                      type="number"
                      value={values.discount}
                      controlId="PurchaseOrderFormDiscountPercentage"
                      name={discount.name}
                      error={errors.discount}
                      onBlur={handleBlur}
                      onChange={handleChange}
                      isValid={touched.discount && !errors.discount}
                      isInvalid={touched.discount && !!errors.discount}
                    />
                  </Stack>
                </Form.Group>

                <ListGroup className="px-0 mt-5" variant="flush">
                  <ListGroup.Item>
                    <Stack direction="horizontal" className="justify-content-between">
                      <p className="m-0">Subtotal</p>
                      <p
                        className={clsx(
                          {
                            '-ive': isNegativeNumber(subtotal),
                          },
                          'm-0 fw-medium price-symbol'
                        )}
                      >
                        {formatPricing(subtotal)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Stack direction="horizontal" className="justify-content-between">
                      <p className="m-0">Taxes</p>
                      <p className={clsx('m-0 fw-medium percentage-symbol pe-3')}>
                        {Number(values.tax ?? 0).toFixed(2)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Stack direction="horizontal" className="justify-content-between">
                      <p className="m-0">Shipping</p>
                      <p className={clsx('m-0 fw-medium', shipping.className)}>{shipping.value}</p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Stack direction="horizontal" className="justify-content-between">
                      <p className="m-0">Discount</p>
                      <p className={clsx('m-0 fw-medium percentage-symbol pe-3')}>
                        {Number(values.discount ?? 0).toFixed(2)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                  <ListGroup.Item>
                    <Stack direction="horizontal" className="justify-content-between">
                      <p className="m-0 fw-bold">Total</p>
                      <p
                        className={clsx(
                          {
                            '-ive': isNegativeNumber(total),
                          },
                          'm-0 fw-bold price-symbol'
                        )}
                      >
                        {formatPricing(total)}
                      </p>
                    </Stack>
                  </ListGroup.Item>
                </ListGroup>
              </Card.Body>
              <Form.Group className="mb-4" controlId="PurchaseOrderFormNotes">
                <Form.Control
                  rows={4}
                  as="textarea"
                  placeholder="Type here to add notes..."
                  className="border-start-0 border-end-0"
                  name={notes.name}
                  value={values.notes}
                  onChange={handleChange}
                  onBlur={handleBlur}
                  isValid={touched.notes && !errors.notes}
                  isInvalid={touched.notes && !!errors.notes}
                />
                <Form.Control.Feedback className="mx-1" type="invalid">
                  {errors.notes}
                </Form.Control.Feedback>
              </Form.Group>

              <div className="container-fluid">
                <p className="fw-bold m-0 mt-2 text-primary">Attachments</p>
                {errors.files && <p className="text-danger">{errors.files.toString()}</p>}

                <Dropzone
                  styles={{ minHeight: 25 }}
                  disabled={loadingAttachments}
                  variant="secondary"
                  onDrop={onDrop}
                  onError={error => setFieldError('files', error.message)}
                  accept={FILE_ALL_TYPES}
                  maxSize={2e7}
                />
                <Row className="gx-2 align-items-stretch justify-content-start">
                  {values.files.length > 0 &&
                    values.files.map((file, indx) => {
                      const currentFileProgress = progress.find(p =>
                        filesData.find(
                          f =>
                            f.unique_name === p.file_id &&
                            `${f.name}.${f.ext}`.toLowerCase() === file.name.toLowerCase()
                        )
                      );
                      const progressed =
                        currentFileProgress && currentFileProgress.progress ? currentFileProgress.progress : 0;
                      return (
                        <Col key={indx} lg={6} className="mb-2">
                          <FileAttachments
                            minified
                            onRemove={() => {
                              setFieldValue(
                                'files',
                                values.files.filter(value => value.name !== file.name)
                              );
                              setTotalFiles(prev => prev - 1);
                            }}
                            progress={progressed}
                            file={file}
                          />
                        </Col>
                      );
                    })}
                  {values.old_files &&
                    values.old_files.length > 0 &&
                    values.old_files.map((file, indx) => (
                      <Col key={indx} lg={6} className="mb-2">
                        <FileAttachments
                          minified
                          onRemove={() => handleFileRemoval(file, values.old_files)}
                          file={file}
                        />
                      </Col>
                    ))}
                </Row>
              </div>
            </div>
          </div>
          <div className="flex-grow-0 sticky-bottom">
            <Card.Footer className="bg-white p-3">
              <div className="text-center">
                <Button
                  variant="light border-primary"
                  className="px-4 py-1 me-3"
                  type="reset"
                  onClick={() => redirect(-1)}
                >
                  Cancel
                </Button>
                <SubmitBtn
                  loading={isSubmitting || loadingAttachments}
                  variant="primary"
                  type="submit"
                  className="px-4 py-1"
                >
                  {update ? 'Update' : 'Save'}
                </SubmitBtn>
              </div>
            </Card.Footer>
          </div>
        </Stack>
      </div>
      {handleClose && show && width < 992 && (
        <div className="summary-detail-bg bg-dark bg-opacity-10" onClick={handleClose}></div>
      )}
    </div>
  );
};

export default SummaryDetails;
