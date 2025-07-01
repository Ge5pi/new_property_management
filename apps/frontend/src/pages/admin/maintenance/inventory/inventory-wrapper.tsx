import { FC, FormEvent, ReactElement, useCallback, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useSearchParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetInventoryLocationByIdQuery, useGetInventoryTypeByIdQuery } from 'services/api/system-preferences';
import { useGetVendorsByIdQuery } from 'services/api/vendors';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';

import { getStringPersonName } from 'utils/functions';

import { IVendor } from 'interfaces/IPeoples';
import { InventoryLocations, InventoryType } from 'interfaces/ISettings';

import './../maintenance.styles.css';

declare type IFormValues = {
  item_type: Option[];
  location: Option[];
  vendor: Option[];
};

declare type IFilterOptions = {
  item_type: string;
  location: string;
  vendor: string;
};
interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterInventorySchema = Yup.object().shape({
  location: Yup.array().max(1, 'This field is required!'),
  item_type: Yup.array().max(1, 'This field is required!'),
  vendor: Yup.array().max(1, 'This field is required!'),
});

const InventoryWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    location: searchParams.get('location') ?? '',
    item_type: searchParams.get('item_type') ?? '',
    vendor: searchParams.get('vendor') ?? '',
  });
  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('location') || searchParams.has('vendor') || searchParams.has('item_type')
  );

  const {
    data: item_type_data,
    isLoading: itemTypeLoading,
    isFetching: itemTypeFetching,
  } = useGetInventoryTypeByIdQuery(
    searchParams.get('item_type') && Number(searchParams.get('item_type')) > 0
      ? Number(searchParams.get('item_type'))
      : skipToken
  );

  const {
    data: location_data,
    isLoading: locationLoading,
    isFetching: locationFetching,
  } = useGetInventoryLocationByIdQuery(
    searchParams.get('location') && Number(searchParams.get('location')) > 0
      ? Number(searchParams.get('location'))
      : skipToken
  );
  const {
    data: vendor_data,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
  } = useGetVendorsByIdQuery(
    searchParams.get('vendor') && Number(searchParams.get('vendor')) > 0
      ? Number(searchParams.get('vendor'))
      : skipToken
  );

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      location: location_data ? [location_data] : ([] as Option[]),
      item_type: item_type_data ? [item_type_data] : ([] as Option[]),
      vendor: vendor_data ? [vendor_data] : ([] as Option[]),
    },
    validationSchema: FilterInventorySchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        (!values.item_type || values.item_type.length <= 0) &&
        (!values.location || values.location.length <= 0) &&
        (!values.vendor || values.vendor.length <= 0)
      ) {
        setSubmitting(false);
        return;
      }

      let item_type_id = '';
      if (values.item_type && values.item_type.length > 0) {
        item_type_id = Number((values.item_type[0] as InventoryType).id).toString();
      }

      let location_id = '';
      if (values.location && values.location.length > 0) {
        location_id = Number((values.location[0] as InventoryLocations).id).toString();
      }

      let vendor_id = '';
      if (values.vendor && values.vendor.length > 0) {
        vendor_id = Number((values.vendor[0] as IVendor).id).toString();
      }

      searchParams.set('page', '1');
      searchParams.set('vendor', vendor_id);
      searchParams.set('item_type', item_type_id);
      searchParams.set('location', location_id);
      setSearchParams(searchParams, { replace: true });
      setFilterData({ vendor: vendor_id, item_type: item_type_id, location: location_id });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('vendor');
    searchParams.delete('item_type');
    searchParams.delete('location');
    setSearchParams(searchParams, { replace: true });
    setFilterData({ vendor: '', item_type: '', location: '' });
    setFieldValue('vendor', []);
    setFieldValue('item_type', []);
    setFieldValue('location', []);
    setFilterStatus(false);
  };

  return children(
    filterData,
    <FilterMenuComponent
      {...rest}
      setFieldValue={setFieldValue}
      values={values}
      handleReset={onReset}
      filterEnabled={filterEnabled}
      loadingStates={{
        vendor: vendorFetching || vendorLoading,
        location: locationFetching || locationLoading,
        item_type: itemTypeFetching || itemTypeLoading,
      }}
    />
  );
};

interface IFCProps {
  values: IFormValues;
  loadingStates: {
    vendor: boolean;
    item_type: boolean;
    location: boolean;
  };
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<IFormValues>>;
  setFieldTouched: (
    field: string,
    touched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<IFormValues>>;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
  handleReset: (e?: unknown) => void;
  errors: FormikErrors<IFormValues>;
  touched: FormikTouched<IFormValues>;
  filterEnabled?: boolean;
}

const FilterMenuComponent = ({
  values,
  handleReset,
  setFieldValue,
  filterEnabled,
  errors,
  touched,
  setFieldTouched,
  handleSubmit,
  loadingStates,
}: IFCProps) => {
  const onInventoryTypeSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('item_type', selected);
      } else {
        setFieldValue('item_type', []);
      }
    },
    [setFieldValue]
  );

  const onLocationSelected = useCallback(
    (selected: Option[]) => {
      if (selected.length) {
        setFieldValue('location', selected);
      } else {
        setFieldValue('location', []);
      }
    },
    [setFieldValue]
  );

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

  return (
    <FilterMenu
      isEnabled={filterEnabled}
      onSubmit={handleSubmit}
      handleReset={handleReset}
      dropdownMenuClassName="filter-menu-container"
    >
      <Row className="gx-sm-4 gx-0">
        <Col lg={6}>
          <FilterPaginateInput
            name="item_type"
            model_label="system_preferences.InventoryItemType"
            labelText="Select Item Type"
            controlId="InventoryFormItemType"
            placeholder={`Item Type Name or ID`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-4',
            }}
            selected={values.item_type}
            onSelectChange={onInventoryTypeSelected}
            onBlurChange={() => setFieldTouched('item_type', true)}
            isValid={touched.item_type && !errors.item_type}
            isInvalid={touched.item_type && !!errors.item_type}
            labelKey={'name'}
            disabled={loadingStates.item_type}
            error={errors.item_type}
          />
        </Col>
        <Col lg={6}>
          <FilterPaginateInput
            name="location"
            model_label="system_preferences.InventoryLocation"
            labelText="Select Item Location"
            controlId={`InventoryFormItemLocation`}
            placeholder={`Item Location Name or ID`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-4',
            }}
            selected={values.location}
            onSelectChange={onLocationSelected}
            onBlurChange={() => setFieldTouched('location', true)}
            isValid={touched.location && !errors.location}
            isInvalid={touched.location && !!errors.location}
            disabled={loadingStates.location}
            labelKey={'name'}
            error={errors.location}
          />
        </Col>
        <Col lg={6}>
          <FilterPaginateInput
            name="vendor"
            labelText="Vendor"
            controlId={`InventoryFormVendor`}
            placeholder={`Select Vendor`}
            classNames={{
              labelClass: 'popup-form-labels',
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
            disabled={loadingStates.vendor}
            error={errors.vendor}
          />
        </Col>
        <Col xs={12}>
          <div className="mb-2 mt-3 text-end">
            <Button variant="light border-primary" className="px-4 py-1 mx-1 mb-1" type="reset">
              Clear
            </Button>

            <SubmitBtn variant="primary" type="submit" className="px-4 py-1 mb-1">
              Apply
            </SubmitBtn>
          </div>
        </Col>
      </Row>
    </FilterMenu>
  );
};

export default InventoryWrapper;
