import { FC, FormEvent, ReactElement, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useSearchParams } from 'react-router-dom';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetUnitByIdQuery } from 'services/api/units';

import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { FilterPaginateInput } from 'core-ui/custom-select';
import { DateRangeInput } from 'core-ui/input-date';

import { getValidID, isPositiveNumber } from 'utils/functions';

import { IUnitsAPI } from 'interfaces/IUnits';

declare type IFormValues = {
  unit: Option[];
  date_range: [string, string];
};

declare type IFilterOptions = {
  date__gte: string;
  date__lte: string;
  unit: string;
};
interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterInspectionSchema = Yup.object().shape({
  unit: Yup.array().max(1, 'This field is required!'),
  date_range: Yup.array().of(Yup.date()).max(2, 'Invalid start and end date found'),
});

const InspectionWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    unit: searchParams.get('unit') ?? '',
    date__gte: searchParams.get('date__gte') ?? '',
    date__lte: searchParams.get('date__lte') ?? '',
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('date__gte') && searchParams.has('date__lte') && searchParams.has('unit')
  );

  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getValidID(searchParams.get('unit')));

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      unit: unit_data && isPositiveNumber(Number(searchParams.get('unit'))) ? [unit_data] : ([] as Option[]),
      date_range: [
        searchParams.has('date__gte') ? (searchParams.get('date__gte') as string) : '',
        searchParams.has('date__lte') ? (searchParams.get('date__lte') as string) : '',
      ] as [string, string],
    },
    validationSchema: FilterInspectionSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        (!values.unit || values.unit.length <= 0) &&
        (values.date_range.length !== 2 || !values.date_range[0] || !values.date_range[1])
      ) {
        setSubmitting(false);
        return;
      }

      const date__gte = values.date_range[0];
      const date__lte = values.date_range[1];

      let unit_id = '';
      if (values.unit && values.unit.length > 0) {
        unit_id = Number((values.unit[0] as IUnitsAPI).id).toString();
      }

      searchParams.set('page', '1');

      searchParams.set('date__gte', date__gte ?? '');
      searchParams.set('date__lte', date__lte ?? '');
      searchParams.set('unit', unit_id);

      setSearchParams(searchParams, { replace: true });
      setFilterData({
        date__gte: date__gte ?? '',
        date__lte: date__lte ?? '',
        unit: unit_id,
      });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');

    searchParams.delete('date__gte');
    searchParams.delete('date__lte');
    searchParams.delete('unit');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ date__gte: '', date__lte: '', unit: '' });

    setFieldValue('unit', []);
    setFieldValue('date_range', []);
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
        unit: unitFetching || unitLoading,
      }}
    />
  );
};

interface IFCProps {
  values: IFormValues;
  loadingStates: {
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
            name="unit"
            model_label="property.Unit"
            labelText="Select Unit"
            controlId={`InspectionWrapperFormUnit`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.unit}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('unit', selected);
              } else {
                setFieldValue('unit', []);
              }
            }}
            labelKey={'name'}
            onBlurChange={() => setFieldTouched('unit', true)}
            isValid={touched.unit && !errors.unit}
            isInvalid={touched.unit && !!errors.unit}
            disabled={loadingStates.unit}
            error={errors.unit}
          />
        </Col>
        <Col lg={8}>
          <div id="inspection-filter-date-range-picker">
            <DateRangeInput
              controlId="InspectionWrapperFormDateRange"
              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
              portalId="inspection-filter-date-range-picker"
              startDateValue={values.date_range[0]}
              endDateValue={values.date_range[1]}
              labelText="Date Range"
              name="date_range"
              resetDate={!values.date_range[0] && !values.date_range[1]}
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

export default InspectionWrapper;
