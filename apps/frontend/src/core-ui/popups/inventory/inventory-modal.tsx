import { useCallback } from 'react';
import { Col, Form, OverlayTrigger, Row, Stack, Tooltip } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';

import { FormikValues, useFormik } from 'formik';
import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import { useGetInventoryLocationByIdQuery, useGetInventoryTypeByIdQuery } from 'services/api/system-preferences';
import { BaseQueryError, GenericMutationTrigger } from 'services/api/types/rtk-query';
import { useGetVendorsByIdQuery } from 'services/api/vendors';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { Popup } from 'components/popup';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { GroupedField } from 'core-ui/grouped-field';
import { InfoIcon } from 'core-ui/icons';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';
import { Notify } from 'core-ui/toast';

import { getIDFromObject, getReadableError, getStringPersonName, renderFormError } from 'utils/functions';

import { IIDName } from 'interfaces/IGeneral';
import { CustomOptionType } from 'interfaces/IInputs';
import { IInventoryAPI, ISingleInventory } from 'interfaces/IInventory';
import { IVendor } from 'interfaces/IPeoples';
import { InventoryLocations, InventoryType } from 'interfaces/ISettings';

const InventorySchema = Yup.object().shape({
  name: Yup.string().trim().required('This field is required!'),
  item_type: yupFilterInput.required('This field is required!'),
  description: Yup.string().trim().required('This field is required!'),
  part_number: Yup.string().trim().required('This field is required!'),
  vendor: Yup.array().of(Yup.object().required('a valid selected option required!')).notRequired(),
  quantity: Yup.number().positive().required('this field is required!'),
  expense_account: Yup.string().trim(),
  cost: Yup.number().positive().required('this field is required!'),
  location: Yup.array().of(Yup.object().required('a valid selected option required!')).notRequired(),
  bin_or_shelf_number: Yup.string().trim(),
});

interface IProps {
  update?: boolean;
  data?: ISingleInventory;
  createInventory?: (data: IInventoryAPI) => Promise<
    | {
        data: ISingleInventory;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
  updateInventory?: (data: Partial<IInventoryAPI>) => Promise<
    | {
        data: ISingleInventory;
        error?: undefined;
      }
    | {
        data?: undefined;
        error: unknown;
      }
  >;
  createInventoryLocation: GenericMutationTrigger<IIDName, InventoryLocations>;
  createInventoryType: GenericMutationTrigger<IIDName, InventoryType>;
}

const InventoryModal = ({
  data,
  createInventoryLocation,
  createInventoryType,
  createInventory,
  update,
  updateInventory,
}: IProps) => {
  const handleFormSubmission = async (values: FormikValues) => {
    const { vendor, location, item_type, ...rest } = values;

    let location_id = null;
    if (location && location.length > 0) {
      location_id = Number((location as Array<InventoryLocations>)[0].id);
      const selection_01 = location[0];
      if (typeof selection_01 !== 'string' && 'customOption' in selection_01) {
        await createInventoryLocation({ name: (selection_01 as CustomOptionType).name }).then(result => {
          if (result.data) {
            location_id = Number(result.data.id);
          } else {
            return result;
          }
        });
      }
    }

    let item_type_id = Number((item_type as Array<InventoryType>)[0].id);

    const selection_02 = item_type[0];
    if (typeof selection_02 !== 'string' && 'customOption' in selection_02) {
      await createInventoryType({ name: (selection_02 as CustomOptionType).name }).then(result => {
        if (result.data) {
          item_type_id = Number(result.data.id);
        } else {
          return result;
        }
      });
    }

    let vendor_id = null;
    if (vendor && vendor.length > 0) {
      vendor_id = Number((vendor as Array<IVendor>)[0].id);
    }

    let api_data: Partial<IInventoryAPI> = {
      ...rest,
      item_type: Number(item_type_id),
      expense_account: '15454589 98598956 6566',
    };

    if (vendor_id && vendor_id > 0) {
      api_data = {
        ...api_data,
        vendor: vendor_id,
      };
    }

    if (location_id && location_id > 0) {
      api_data = {
        ...api_data,
        location: location_id,
      };
    }

    if (updateInventory && update && data && data.id) {
      return await updateInventory({ ...api_data, id: data.id });
    } else if (createInventory) {
      return await createInventory(api_data as IInventoryAPI);
    }

    return Promise.reject('Incomplete information provided!');
  };

  const {
    data: type_data,
    isLoading: typeLoading,
    isFetching: typeFetching,
  } = useGetInventoryTypeByIdQuery(getIDFromObject('item_type', data));
  const {
    data: location_data,
    isLoading: locationLoading,
    isFetching: locationFetching,
  } = useGetInventoryLocationByIdQuery(getIDFromObject('location', data));
  const {
    data: vendor_data,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
  } = useGetVendorsByIdQuery(getIDFromObject('vendor', data));

  const formik = useFormik({
    initialValues: {
      name: data?.name ?? '',
      item_type: type_data ? [type_data] : ([] as Option[]),
      description: data?.description ?? '',
      part_number: data?.part_number ?? '',
      vendor: vendor_data ? [vendor_data] : ([] as Option[]),
      quantity: data?.quantity ?? '',
      expense_account: data?.expense_account ?? '',
      cost: data?.cost ?? '',
      location: location_data ? [location_data] : ([] as Option[]),
      bin_or_shelf_number: data?.bin_or_shelf_number ?? '',
    },
    validationSchema: InventorySchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting, setFieldError }) => {
      setSubmitting(true);
      SwalExtended.showLoading();

      handleFormSubmission(values)
        .then(result => {
          if (result.data) {
            SwalExtended.close();
          } else {
            const error = result.error as BaseQueryError;
            if (error.status === 400 && error.data) {
              renderFormError(error.data, setFieldError);
            }
          }
        })
        .catch(error => {
          Notify.show({
            type: 'danger',
            title: 'Something went wrong, please check your input record',
            description: getReadableError(error),
          });
        })
        .finally(() => {
          setSubmitting(false);
          SwalExtended.hideLoading();
        });
    },
  });

  const {
    handleSubmit,
    handleChange,
    handleBlur,
    touched,
    values,
    setFieldValue,
    setFieldTouched,
    isSubmitting,
    handleReset,
    errors,
  } = formik;

  const onVendorSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('vendor', selected);
      } else {
        setFieldValue('vendor', []);
      }
    },
    [setFieldValue]
  );

  const onInvTypeSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('item_type', selected);
      } else {
        setFieldValue('item_type', []);
      }
    },
    [setFieldValue]
  );

  const onInvLocationSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('location', selected);
      } else {
        setFieldValue('location', []);
      }
    },
    [setFieldValue]
  );

  return (
    <Popup
      title={`${update ? 'Update' : 'Create'} inventory item`}
      subtitle="Fill the information for this item"
      onSubmit={handleSubmit}
      onReset={handleReset}
      isSubmitting={isSubmitting}
    >
      <Row className="gx-sm-4 gx-0">
        <Form.Group as={Col} sm={6} className="mb-3" controlId="InventoryFormName">
          <Form.Label className="popup-form-labels">Inventory Name</Form.Label>
          <Form.Control
            autoFocus
            type="text"
            placeholder="Enter Inventory name here..."
            name="name"
            value={values.name}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.name && !errors.name}
            isInvalid={touched.name && !!errors.name}
          />
          <Form.Control.Feedback type="invalid">{errors.name}</Form.Control.Feedback>
        </Form.Group>
        <Col md={5} xs>
          <FilterPaginateInput
            allowNew
            model_label="system_preferences.InventoryItemType"
            name="item_type"
            labelText="Item Type"
            placeholder="Type Here..."
            controlId={`InventoryFormType`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.item_type}
            onSelectChange={onInvTypeSelected}
            onBlurChange={() => setFieldTouched('item_type', true)}
            isValid={touched.item_type && !errors.item_type}
            isInvalid={touched.item_type && !!errors.item_type}
            labelKey={`name`}
            searchIcon={false}
            error={errors.item_type}
            disabled={typeLoading || typeFetching}
          />
        </Col>
      </Row>

      <Row className="gx-sm-4 gx-0">
        <Form.Group as={Col} sm={6} className="mb-3" controlId="InventoryFormDescription">
          <Form.Label className="popup-form-labels">Description</Form.Label>
          <Form.Control
            placeholder="Some description here"
            as="textarea"
            rows={3}
            name="description"
            value={values.description}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.description && !errors.description}
            isInvalid={touched.description && !!errors.description}
          />
          <Form.Control.Feedback type="invalid">{errors.description}</Form.Control.Feedback>
        </Form.Group>
        <Col md={5} xs>
          <Form.Group className="mb-3" controlId="InventoryFormPartNumber">
            <Form.Label className="popup-form-labels">Part Number</Form.Label>
            <Form.Control
              type="text"
              placeholder="Some text here..."
              name="part_number"
              value={values.part_number}
              onChange={handleChange}
              onBlur={handleBlur}
              isValid={touched.part_number && !errors.part_number}
              isInvalid={touched.part_number && !!errors.part_number}
            />
            <Form.Control.Feedback type="invalid">{errors.part_number}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>

      <Row className="gx-sm-4 gx-0">
        <Col sm={6}>
          <FilterPaginateInput
            name="vendor"
            labelText={
              <Stack direction="horizontal" className="justify-content-between">
                <span className="popup-form-labels flex-fill">Vendor</span>
                <span className="text-muted small">Optional</span>
              </Stack>
            }
            controlId={`InventoryFormVendor`}
            placeholder={`Choose Vendor`}
            classNames={{
              labelClass: 'w-100',
              wrapperClass: 'mb-3',
            }}
            selected={values.vendor}
            onSelectChange={onVendorSelected}
            onBlurChange={() => setFieldTouched('vendor', true)}
            isValid={touched.vendor && !errors.vendor}
            isInvalid={touched.vendor && !!errors.vendor}
            model_label="people.Vendor"
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
            error={errors.vendor}
            disabled={vendorLoading || vendorFetching}
          />
        </Col>
        <Form.Group as={Col} md={3} xs className="mb-3" controlId="InventoryFormQuantity">
          <Form.Label className="w-100">
            <Stack direction="horizontal" className="justify-content-between">
              <span className="popup-form-labels flex-fill">Quantity</span>
              <OverlayTrigger
                overlay={tooltipProps => (
                  <Tooltip {...tooltipProps} arrowProps={{ style: { display: 'none' } }} id={`quantity-info-tooltip`}>
                    This is the current quantity of the inventory item. In future, the quantity of the item will
                    increase by the purchase order and decrease by installing them in the properties being fixed assets
                  </Tooltip>
                )}
              >
                <span className="text-muted small link text-muted">
                  <InfoIcon />
                </span>
              </OverlayTrigger>
            </Stack>
          </Form.Label>
          <Form.Control
            type="number"
            min={0}
            step={0.1}
            placeholder="0.0"
            name="quantity"
            value={values.quantity}
            readOnly={update}
            disabled={update}
            onChange={update ? undefined : handleChange}
            onBlur={handleBlur}
            isValid={touched.quantity && !errors.quantity}
            isInvalid={touched.quantity && !!errors.quantity}
          />
          <Form.Control.Feedback type="invalid">{errors.quantity}</Form.Control.Feedback>
        </Form.Group>
      </Row>
      <h6 className="text-primary fw-bold mt-3">Account details</h6>
      <Row className="gx-sm-4 gx-0">
        <Form.Group as={Col} sm={6} className="mb-3" controlId="InventoryFormExpense">
          <Form.Label className="popup-form-labels">GL Account</Form.Label>
          <Form.Control
            type="text"
            readOnly
            disabled
            placeholder="Expense account"
            defaultValue={values.expense_account}
          />
        </Form.Group>
        <Col md={4} sm={6}>
          <GroupedField
            min="0"
            controlId="InventoryFormCost"
            label="Cost"
            type="number"
            placeholder="0.00"
            step={0.01}
            position="end"
            wrapperClass="mb-3"
            icon="$"
            name="cost"
            value={values.cost}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.cost && !errors.cost}
            isInvalid={touched.cost && !!errors.cost}
            error={errors.cost}
          />
        </Col>
      </Row>
      <h6 className="text-primary mt-3">
        <span className="fw-bold">Storage details</span>
        <span className="text-muted small ms-3">Optional</span>
      </h6>
      <Row className="gx-sm-4 gx-0">
        <Col md={4} sm={6} xs={12}>
          <FilterPaginateInput
            allowNew
            name="location"
            model_label="system_preferences.InventoryLocation"
            labelText="Item Location"
            placeholder="Type Here..."
            controlId={`InventoryFormLocation`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.location}
            onSelectChange={onInvLocationSelected}
            onBlurChange={() => setFieldTouched('location', true)}
            isValid={touched.location && !errors.location}
            isInvalid={touched.location && !!errors.location}
            labelKey={`name`}
            searchIcon={false}
            error={errors.location}
            disabled={locationLoading || locationFetching}
          />
        </Col>
        <Form.Group as={Col} md={3} sm xs={12} className="mb-3" controlId="InventoryFormBinShelfNumber">
          <Form.Label className="popup-form-labels">Bin / Shelf number</Form.Label>
          <Form.Control
            type="number"
            min={0}
            step={0.1}
            placeholder="0.0"
            name="bin_or_shelf_number"
            value={values.bin_or_shelf_number}
            onChange={handleChange}
            onBlur={handleBlur}
            isValid={touched.bin_or_shelf_number && !errors.bin_or_shelf_number}
            isInvalid={touched.bin_or_shelf_number && !!errors.bin_or_shelf_number}
          />
          <Form.Control.Feedback type="invalid">{errors.bin_or_shelf_number}</Form.Control.Feedback>
        </Form.Group>
      </Row>
    </Popup>
  );
};

export default ProviderHOC(InventoryModal);
