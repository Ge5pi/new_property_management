import { FC, FormEvent, ReactElement, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useSearchParams } from 'react-router-dom';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetUnitByIdQuery } from 'services/api/units';

import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { DateRangeInput } from 'core-ui/input-date';

import { getSearchFilter, getValidID, isPositiveNumber } from 'utils/functions';

import { ChargeStatus } from 'interfaces/IAccounting';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

declare type FilterStatusType = ChargeStatus | '';
declare type IFormValues = {
  unit: Option[];
  parent_property: Option[];
  date_range: [string, string];
  status: FilterStatusType;
};

declare type IFilterOptions = {
  created_at__gte: string;
  created_at__lte: string;
  unit: string;
  parent_property: string;
  status: FilterStatusType;
};
interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterChargeSchema = Yup.object().shape({
  parent_property: Yup.array().max(1, 'This field is required!'),
  unit: Yup.array().max(1, 'This field is required!'),
  date_range: Yup.array().of(Yup.date()).max(2, 'Invalid start and end date found'),

  status: Yup.string().trim().oneOf(['NOT_VERIFIED', 'VERIFIED', 'PAID', 'UNPAID'], 'Select a valid value'),
});

const ChargesWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    unit: searchParams.get('unit') ?? '',
    parent_property: searchParams.get('parent_property') ?? '',
    created_at__gte: searchParams.get('created_at__gte') ?? '',
    created_at__lte: searchParams.get('created_at__lte') ?? '',
    status: (searchParams.get('status') as FilterStatusType) ?? '',
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('created_at__gte') &&
      searchParams.has('status') &&
      searchParams.has('created_at__lte') &&
      searchParams.has('unit') &&
      searchParams.has('parent_property')
  );

  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getValidID(searchParams.get('unit')));

  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getValidID(searchParams.get('parent_property')));

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      unit: unit_data && isPositiveNumber(Number(searchParams.get('unit'))) ? [unit_data] : ([] as Option[]),
      parent_property:
        property_data && isPositiveNumber(Number(searchParams.get('parent_property')))
          ? [property_data]
          : ([] as Option[]),
      date_range: [
        searchParams.has('created_at__gte') ? (searchParams.get('created_at__gte') as string) : '',
        searchParams.has('created_at__lte') ? (searchParams.get('created_at__lte') as string) : '',
      ] as [string, string],

      status: searchParams.has('status') ? (searchParams.get('status') as FilterStatusType) : '',
    },
    validationSchema: FilterChargeSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        !values.status &&
        (!values.unit || values.unit.length <= 0) &&
        (!values.parent_property || values.parent_property.length <= 0) &&
        (values.date_range.length !== 2 || !values.date_range[0] || !values.date_range[1])
      ) {
        setSubmitting(false);
        return;
      }

      const created_at__gte = values.date_range[0];
      const created_at__lte = values.date_range[1];

      let property_id = '';
      if (values.parent_property && values.parent_property.length > 0) {
        property_id = Number((values.parent_property[0] as IPropertyAPI).id).toString();
      }

      let unit_id = '';
      if (values.unit && values.unit.length > 0) {
        unit_id = Number((values.unit[0] as IUnitsAPI).id).toString();
      }

      searchParams.set('page', '1');
      searchParams.set('status', values.status);

      searchParams.set('created_at__gte', created_at__gte ?? '');
      searchParams.set('created_at__lte', created_at__lte ?? '');

      searchParams.set('parent_property', property_id);
      searchParams.set('unit', unit_id);
      setSearchParams(searchParams, { replace: true });
      setFilterData({
        created_at__gte: created_at__gte ?? '',
        created_at__lte: created_at__lte ?? '',

        status: values.status,
        parent_property: property_id,
        unit: unit_id,
      });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');

    searchParams.delete('created_at__gte');
    searchParams.delete('created_at__lte');

    searchParams.delete('parent_property');
    searchParams.delete('status');
    searchParams.delete('unit');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ status: '', created_at__gte: '', created_at__lte: '', parent_property: '', unit: '' });
    setFieldValue('status', '');

    setFieldValue('date_range', []);
    setFieldValue('parent_property', []);
    setFieldValue('unit', []);
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
        property: propertyFetching || propertyLoading,
        unit: unitFetching || unitLoading,
      }}
    />
  );
};

interface IFCProps {
  values: IFormValues;
  loadingStates: {
    property: boolean;
    unit: boolean;
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
  loadingStates,
  handleReset,
  setFieldValue,
  filterEnabled,
  errors,
  touched,
  setFieldTouched,
  handleSubmit,
}: IFCProps) => {
  return (
    <FilterMenu
      isEnabled={filterEnabled}
      onSubmit={handleSubmit}
      handleReset={handleReset}
      dropdownMenuClassName="filter-menu-container"
    >
      <Row className="gx-sm-3 gx-0">
        <Col lg={6}>
          <FilterPaginateInput
            name="parent_property"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`ChargeWrapperFormProperty`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.parent_property}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('parent_property', selected);
              } else {
                setFieldValue('parent_property', []);
              }

              setFieldValue('unit', []);
            }}
            labelKey={'name'}
            onBlurChange={() => setFieldTouched('parent_property', true)}
            isValid={touched.parent_property && !errors.parent_property}
            isInvalid={touched.parent_property && !!errors.parent_property}
            disabled={loadingStates.unit || loadingStates.property}
            error={errors.parent_property}
          />
        </Col>
        <Col lg={6}>
          <FilterPaginateInput
            name="unit"
            labelText="Search Unit"
            model_label="property.Unit"
            filter={getSearchFilter(values.parent_property, 'parent_property')}
            controlId={`FixedAssetImportFormUnit`}
            placeholder={`Select Unit`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            labelKey={'name'}
            selected={values.unit}
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
            preload={getSearchFilter(values.parent_property, 'parent_property', true)}
            disabled={values.parent_property.length <= 0 || loadingStates.unit}
            error={errors.unit}
          />
        </Col>
        <Col lg={8}>
          <div id="charge-filter-date-range-picker">
            <DateRangeInput
              controlId="ChargeWrapperFormDateRange"
              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
              portalId="charge-filter-date-range-picker"
              startDateValue={values.date_range[0]}
              endDateValue={values.date_range[1]}
              resetDate={!values.date_range[0] && !values.date_range[1]}
              labelText="Date Range"
              name="date_range"
              onDateRangeSelection={(start, end) => setFieldValue('date_range', [start, end])}
              onBlur={() => setFieldTouched('date_range')}
              isValid={touched.date_range && !errors.date_range}
              isInvalid={touched.date_range && !!errors.date_range}
              error={errors.date_range}
            />
          </div>
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col lg={12}>
          <p className="form-label-sm mb-2">Status</p>
          <Row className="gx-0">
            <Col>
              <Row className="gx-0">
                <Form.Group as={Col} xs={'auto'} controlId="FilterDataOptionFormNotVerified">
                  <Form.Check
                    type={'radio'}
                    label={`NOT VERIFIED`}
                    className="small text-primary"
                    name="status"
                    value={'NOT_VERIFIED'}
                    defaultChecked={values.status === 'NOT_VERIFIED'}
                    onChange={ev => setFieldValue('status', ev.target.value)}
                    onBlur={() => setFieldTouched('status')}
                    isInvalid={touched.status && !!errors.status}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="FilterDataOptionFormVerified">
                  <Form.Check
                    type={'radio'}
                    label={`VERIFIED`}
                    className="small text-primary"
                    name="status"
                    value={'VERIFIED'}
                    defaultChecked={values.status === 'VERIFIED'}
                    onChange={ev => setFieldValue('status', ev.target.value)}
                    onBlur={() => setFieldTouched('status')}
                    isInvalid={touched.status && !!errors.status}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="FilterDataOptionFormPaid">
                  <Form.Check
                    type={'radio'}
                    label={`PAID`}
                    className="small text-primary"
                    name="status"
                    value={'PAID'}
                    defaultChecked={values.status === 'PAID'}
                    onChange={ev => setFieldValue('status', ev.target.value)}
                    onBlur={() => setFieldTouched('status')}
                    isInvalid={touched.status && !!errors.status}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="FilterDataOptionFormUnpaid">
                  <Form.Check
                    type={'radio'}
                    label={`UNPAID`}
                    className="small text-primary"
                    name="status"
                    value={'UNPAID'}
                    defaultChecked={values.status === 'UNPAID'}
                    onChange={ev => setFieldValue('status', ev.target.value)}
                    onBlur={() => setFieldTouched('status')}
                    isInvalid={touched.status && !!errors.status}
                  />
                </Form.Group>
              </Row>
            </Col>
          </Row>
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

export default ChargesWrapper;
