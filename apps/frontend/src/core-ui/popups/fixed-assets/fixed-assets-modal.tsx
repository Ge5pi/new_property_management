import { useCallback, useMemo } from 'react';
import { Col, Form, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { clsx } from 'clsx';
import { useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useCreateFixedAssetsMutation, useUpdateFixedAssetsMutation } from 'services/api/fixed-assets';
import { useGetInventoryByIdQuery } from 'services/api/inventory';
import { useGetPropertyByIdQuery } from 'services/api/properties';
import { BaseQueryError } from 'services/api/types/rtk-query';
import { useGetUnitByIdQuery } from 'services/api/units';

import { Popup } from 'components/popup';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';
import { InfoIcon } from 'core-ui/icons';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { RenderInformation } from 'core-ui/render-information';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import {
  formatPricing,
  getIDFromObject,
  getReadableError,
  getSearchFilter,
  getValidID,
  isNegativeNumber,
  renderFormError,
} from 'utils/functions';

import { FixedAssetStatus, IFixedAssets } from 'interfaces/IAssets';
import { IInventoryAPI } from 'interfaces/IInventory';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

const AssetsSchema = Yup.object().shape({
  unit: yupFilterInput.required('This field is required!'),
  inventory_item: yupFilterInput.required('This field is required!'),
  property_id: yupFilterInput.required('This field is required!'),
  quantity: Yup.number()
    .positive()
    .required('this field is required!')
    .test({
      name: 'item-quantity-validation',
      test: function (value) {
        if (value && this.parent.inventory_item) {
          const item = this.parent.inventory_item as IInventoryAPI[];
          if (item.length > 0) {
            return value <= item[0].quantity
              ? true
              : this.createError({
                  message: `quantity must be smaller than or equal to Available Quantity: ${item[0].quantity}`,
                  path: 'quantity',
                });
          }
        }
        return false;
      },
    }),
  placed_in_service_date: Yup.date().required('This field is required!'),
  warranty_expiration_date: Yup.date()
    .when('placed_in_service_date', (start_time: Date[], schema) => {
      const date = start_time && start_time.length > 0 && start_time[0];
      if (date) {
        const currentDay = new Date(date.getTime());
        return schema.min(currentDay, 'Expiration date must be after placed-in date');
      } else {
        return schema;
      }
    })
    .required('This field is required!'),
  status: Yup.string()
    .trim()
    .oneOf(['in_storage', 'installed'], 'Select a valid value')
    .required('This field is required!'),
});

interface IProps {
  update?: boolean;
  parent_property__id?: number;
  data?: IFixedAssets;
}

const FixedAssetsModal = ({ data, update, parent_property__id }: IProps) => {
  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(data ? getIDFromObject('property_id', data) : getValidID(parent_property__id));

  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getIDFromObject('unit', data));

  const {
    data: inventory_data,
    isLoading: inventoryLoading,
    isFetching: inventoryFetching,
  } = useGetInventoryByIdQuery(getIDFromObject('inventory_item', data));

  const [createFixedAsset] = useCreateFixedAssetsMutation();
  const [updateFixedAsset] = useUpdateFixedAssetsMutation();

  const handleFormSubmission = async (values: IFixedAssets) => {
    const record_id = data && data.id ? Number(data.id) : -1;
    const response =
      update && record_id > 0
        ? await updateFixedAsset({ ...values, id: record_id }).unwrap()
        : await createFixedAsset(values).unwrap();

    return {
      data: response,
      feedback: `Record has been successfully ${update ? 'updated!' : 'created!'}`,
      status: 'success' as 'success' | 'warning',
    };
  };

  const formik = useFormik({
    initialValues: {
      placed_in_service_date: data?.placed_in_service_date ?? '',
      warranty_expiration_date: data?.warranty_expiration_date ?? '',
      unit: unit_data ? [unit_data] : ([] as Option[]),
      inventory_item: inventory_data ? [inventory_data] : ([] as Option[]),
      property_id: property_data ? [property_data] : ([] as Option[]),
      status: data?.status ?? ('in_storage' as FixedAssetStatus),
      quantity: data?.quantity ?? 0,
      cost: data?.cost ?? 0,
    },
    validationSchema: AssetsSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      let property_id = 0;
      if (values.property_id && Array.isArray(values.property_id) && values.property_id.length > 0) {
        property_id = Number((values.property_id[0] as IPropertyAPI).id);
      }

      let unit = 0;
      if (values.unit && Array.isArray(values.unit) && values.unit.length > 0) {
        unit = Number((values.unit[0] as IUnitsAPI).id);
      }

      let inventory_item = 0;
      if (values.inventory_item && Array.isArray(values.inventory_item) && values.inventory_item.length > 0) {
        inventory_item = Number((values.inventory_item[0] as IInventoryAPI).id);
      }

      handleFormSubmission({ ...values, inventory_item, unit, property_id })
        .then(result => {
          Notify.show({ type: result.status, title: result.feedback });
          SwalExtended.close({ isConfirmed: true, value: Number(result.data.id) });
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
          SwalExtended.hideLoading();
        });
    },
  });

  const {
    handleSubmit,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    handleBlur,
    handleChange,
    isSubmitting,
    handleReset,
    errors,
  } = formik;

  const onInventoryNameSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('inventory_item', selected);
        setFieldValue('quantity', (selected[0] as IInventoryAPI).quantity);
        setFieldValue('cost', (selected[0] as IInventoryAPI).cost);
      } else {
        setFieldValue('inventory_item', []);
        setFieldValue('quantity', 0);
        setFieldValue('cost', 0);
      }
    },
    [setFieldValue]
  );

  const inventory_item = useMemo(() => {
    if (values.inventory_item && Array.isArray(values.inventory_item) && values.inventory_item.length > 0) {
      return values.inventory_item[0] as IInventoryAPI;
    }
  }, [values.inventory_item]);

  return (
    <Popup
      title={`${update ? 'Update' : 'Add'} fixed assets`}
      subtitle={'Enter the property fixed assets'}
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Row className="gy-1 mb-2">
        <Col xs={12}>
          <FilterPaginateInput
            autoFocus
            name="inventory_item"
            labelText="Inventory Item"
            placeholder="Type Here..."
            controlId={`AssetsFormInventoryItem`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.inventory_item}
            onSelectChange={onInventoryNameSelected}
            onBlurChange={() => setFieldTouched('inventory_item', true)}
            isValid={touched.inventory_item && !errors.inventory_item}
            isInvalid={touched.inventory_item && !!errors.inventory_item}
            labelKey={`name`}
            renderMenuItemChildren={(option: Option) => {
              const inv = option as IInventoryAPI;
              return (
                <div className="text-wrap small">
                  <div className="fw-bold text-uppercase">{inv.name}</div>
                  <Stack direction="horizontal" gap={1} className="text-truncate small">
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
                    <span>Q: {inv.quantity}</span>
                  </Stack>
                </div>
              );
            }}
            searchIcon={false}
            error={errors.inventory_item}
            model_label="maintenance.Inventory"
            disabled={inventoryLoading || inventoryFetching}
          />
        </Col>
      </Row>
      {inventory_item && (
        <Row className="gy-4 mb-2">
          <Col>
            <RenderInformation title="Cost" desClass="price-symbol" description={inventory_item.cost} />
          </Col>
          <Col>
            <RenderInformation title="Quantity" description={inventory_item.quantity} />
          </Col>
        </Row>
      )}
      <Row className="gy-4 mb-2">
        <Form.Group as={Col} sm={4} xs={8} className="mb-3" controlId="FixedAssetsFormQuantity">
          <Form.Label className="w-100">
            <Stack direction="horizontal" className="justify-content-between">
              <span className="popup-form-labels flex-fill">Available Quantity</span>
              {inventory_item && (
                <OverlayTrigger
                  overlay={tooltipProps => (
                    <Tooltip {...tooltipProps} arrowProps={{ style: { display: 'none' } }} id={`quantity-info-tooltip`}>
                      quantity must be smaller than or equal to Available Quantity:
                      <span className="mx-1 fw-bold">{inventory_item.quantity}</span>
                    </Tooltip>
                  )}
                >
                  <span className="text-muted small link text-muted">
                    <InfoIcon />
                  </span>
                </OverlayTrigger>
              )}
            </Stack>
          </Form.Label>
          <Form.Control
            type="number"
            min={0}
            step={0.1}
            placeholder="0.0"
            name="quantity"
            value={values.quantity}
            readOnly={values.inventory_item.length <= 0}
            disabled={values.inventory_item.length <= 0}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.quantity && !errors.quantity}
            isInvalid={touched.quantity && !!errors.quantity}
          />
          <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
        </Form.Group>
        <Col sm={{ span: 'auto', offset: 2 }} xs>
          <RenderInformation
            title="Total Cost"
            titleClass="mb-3 mt-1"
            description={((values.quantity ?? 0) * (inventory_item ? inventory_item.cost : 0)).toFixed(2)}
          />
        </Col>
      </Row>
      <Row className="gy-1 mb-2">
        <Col xs={12}>
          <FilterPaginateInput
            name="property_id"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`FixedAssetFormProperty`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.property_id}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('property_id', selected);
              } else {
                setFieldValue('property_id', []);
              }

              setFieldValue('unit', []);
            }}
            onBlurChange={() => setFieldTouched('property_id', true)}
            isValid={touched.property_id && !errors.property_id}
            isInvalid={touched.property_id && !!errors.property_id}
            labelKey={'name'}
            disabled={propertyLoading || propertyFetching || Boolean(parent_property__id && parent_property__id > 0)}
            error={errors.property_id}
          />
        </Col>
        <Col xs={12}>
          <FilterPaginateInput
            name="unit"
            labelText="Search Unit"
            model_label="property.Unit"
            filter={getSearchFilter(values.property_id, 'parent_property')}
            controlId={`FixedAssetFormUnit`}
            placeholder={`Select Unit`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.unit}
            labelKey={'name'}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('unit', selected);
              } else {
                setFieldValue('unit', []);
              }
            }}
            onBlurChange={() => setFieldTouched('unit', true)}
            isValid={touched.unit && !errors.unit}
            isInvalid={touched.unit && !!errors.unit}
            preload={getSearchFilter(values.property_id, 'parent_property', true)}
            disabled={values.property_id.length <= 0 || unitLoading || unitFetching}
            error={errors.unit}
          />
        </Col>
        <Col sm>
          <InputDate
            name={'placed_in_service_date'}
            labelText={'Placed In Service'}
            controlId="FixedAssetsFormPlacedInService"
            classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
            value={values.placed_in_service_date}
            onDateSelection={date => setFieldValue('placed_in_service_date', date)}
            onBlur={() => setFieldTouched('placed_in_service_date')}
            isValid={touched.placed_in_service_date && !errors.placed_in_service_date}
            isInvalid={touched.placed_in_service_date && !!errors.placed_in_service_date}
            error={errors.placed_in_service_date}
          />
        </Col>
        <Col sm>
          <InputDate
            name={'warranty_expiration_date'}
            labelText={'Warranty Expire'}
            controlId="FixedAssetsFormWarrantyExpire"
            classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
            value={values.warranty_expiration_date}
            minDate={new Date(values.placed_in_service_date)}
            onDateSelection={date => setFieldValue('warranty_expiration_date', date)}
            onBlur={() => setFieldTouched('warranty_expiration_date')}
            isValid={touched.warranty_expiration_date && !errors.warranty_expiration_date}
            isInvalid={touched.warranty_expiration_date && !!errors.warranty_expiration_date}
            error={errors.warranty_expiration_date}
          />
        </Col>
        <Col sm>
          <CustomSelect
            labelText="Status"
            controlId={`FixedAssetsFormStatus`}
            options={[
              { label: 'Installed', value: 'installed' },
              { label: 'In Storage', value: 'in_storage' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            name="status"
            value={values.status}
            onSelectChange={value => setFieldValue('status', value)}
            onBlurChange={() => setFieldTouched('status', true)}
            isValid={touched.status && !errors.status}
            isInvalid={touched.status && !!errors.status}
            error={errors.status}
          />
        </Col>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(FixedAssetsModal);
