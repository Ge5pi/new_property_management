import { FC, FormEvent, ReactElement, useCallback, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useSearchParams } from 'react-router-dom';

import { skipToken } from '@reduxjs/toolkit/query';
import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetVendorsByIdQuery } from 'services/api/vendors';

import { ItemInputItem, ItemMenuItem } from 'components/custom-cell';
import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { InputMultiRange } from 'core-ui/input-multi-range';

import { getStringPersonName } from 'utils/functions';

import { IVendor } from 'interfaces/IPeoples';

import './../maintenance.styles.css';

declare type IFormValues = {
  vendor: Option[];
  total_greater_than_equal: string | number;
  total_less_than_equal: string | number;
};

declare type IFilterOptions = {
  vendor: string;
  total_greater_than_equal: string | number;
  total_less_than_equal: string | number;
};
interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterPurchaseOrderSchema = Yup.object().shape({
  vendor: Yup.array().max(1, 'This field is required!'),
  total_less_than_equal: Yup.number().positive(),
  total_greater_than_equal: Yup.number().positive(),
});

const PurchaseOrderWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    vendor: searchParams.get('vendor') ?? '',
    total_greater_than_equal: searchParams.get('total_greater_than_equal') ?? '',
    total_less_than_equal: searchParams.get('total_less_than_equal') ?? '',
  });
  const [filterEnabled, setFilterStatus] = useState(searchParams.has('vendor'));

  const {
    data: vendor_data,
    isLoading: vendorLoading,
    isFetching: vendorFetching,
  } = useGetVendorsByIdQuery(
    searchParams.get('vendor') && Number(searchParams.get('vendor')) > 0
      ? Number(searchParams.get('vendor'))
      : skipToken
  );

  const maxValue =
    searchParams.get('total_less_than_equal') && Number(searchParams.get('total_less_than_equal')) > 0
      ? Number(searchParams.get('total_less_than_equal'))
      : 50000;

  const minValue =
    searchParams.get('total_greater_than_equal') && Number(searchParams.get('total_greater_than_equal')) > 0
      ? Number(searchParams.get('total_greater_than_equal'))
      : 1;

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      vendor: vendor_data ? [vendor_data] : ([] as Option[]),
      total_less_than_equal: maxValue,
      total_greater_than_equal: minValue,
    },
    validationSchema: FilterPurchaseOrderSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        (!values.vendor || values.vendor.length <= 0) &&
        !values.total_greater_than_equal &&
        !values.total_less_than_equal
      ) {
        setSubmitting(false);
        return;
      }

      let vendor_id = '';
      if (values.vendor && values.vendor.length > 0) {
        vendor_id = Number((values.vendor[0] as IVendor).id).toString();
      }

      searchParams.set('page', '1');
      searchParams.set('vendor', vendor_id);
      searchParams.set('total_less_than_equal', values.total_less_than_equal.toString());
      searchParams.set('total_greater_than_equal', values.total_greater_than_equal.toString());
      setSearchParams(searchParams, { replace: true });
      setFilterData({ ...values, vendor: vendor_id });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('vendor');
    searchParams.delete('total_greater_than_equal');
    searchParams.delete('total_less_than_equal');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ vendor: '', total_greater_than_equal: '', total_less_than_equal: '' });

    setFieldValue('vendor', []);
    setFieldValue('total_greater_than_equal', 1);
    setFieldValue('total_less_than_equal', 50000);

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
      }}
    />
  );
};

interface IFCProps {
  values: IFormValues;
  loadingStates: {
    vendor: boolean;
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
            name="vendor"
            labelText="Vendor"
            controlId={`PurchaseOrderFormVendor`}
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
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col lg={8} xs={12}>
          <p className="popup-form-labels">Amount Range</p>
          <InputMultiRange
            min={5}
            max={100000}
            containerClass="mb-5 mt-1"
            maxName="maxPriceRange"
            minName="minPriceRange"
            maxLabelClass="price-symbol"
            minLabelClass="price-symbol"
            maxValue={values.total_less_than_equal as number}
            minValue={values.total_greater_than_equal as number}
            onRangeChange={(min, max) => {
              setFieldValue('total_less_than_equal', max);
              setFieldValue('total_greater_than_equal', min);
            }}
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

export default PurchaseOrderWrapper;
