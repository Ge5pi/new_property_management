import { FC, FormEvent, ReactElement, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { Option } from 'react-bootstrap-typeahead/types/types';
import { useSearchParams } from 'react-router-dom';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { useGetPropertyByIdQuery } from 'services/api/properties';
import { useGetUnitByIdQuery } from 'services/api/units';

import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect, FilterPaginateInput } from 'core-ui/custom-select';

import { getSearchFilter, getValidID } from 'utils/functions';

import { RentalStatusType } from 'interfaces/IApplications';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

declare type IFormValues = {
  unit: Option[];
  unit__parent_property: Option[];
  rental_application__status: RentalStatusType | '';
};

declare type IFilterOptions = {
  unit: string;
  unit__parent_property: string;
  rental_application__status: RentalStatusType | '';
};

interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterRentalApplicationSchema = Yup.object().shape({
  unit: Yup.array().max(1, 'This field is required!'),
  unit__parent_property: Yup.array().max(1, 'This field is required!'),
  rental_application__status: Yup.string()
    .trim()
    .oneOf(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD_OR_WAITING'], 'Select a valid value'),
});

const RentalWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    unit: searchParams.get('unit') ?? '',
    unit__parent_property: searchParams.get('unit__parent_property') ?? '',
    rental_application__status: (searchParams.get('rental_application__status') ?? '') as RentalStatusType,
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('unit__parent_property') ||
      searchParams.has('unit') ||
      searchParams.has('rental_application__status')
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
  } = useGetPropertyByIdQuery(getValidID(searchParams.get('unit__parent_property')));

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      unit: unit_data ? [unit_data] : ([] as Option[]),
      unit__parent_property: property_data ? [property_data] : ([] as Option[]),
      rental_application__status: (searchParams.get('rental_application__status') ?? '') as RentalStatusType,
    },
    validationSchema: FilterRentalApplicationSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        (!values.unit__parent_property || values.unit__parent_property.length <= 0) &&
        (!values.unit || values.unit.length <= 0) &&
        !values.rental_application__status
      ) {
        setSubmitting(false);
        return;
      }

      let unit_id = '';
      if (values.unit && values.unit.length > 0) {
        unit_id = Number((values.unit[0] as IUnitsAPI).id).toString();
      }

      let unit__parent_property_id = '';
      if (values.unit__parent_property && values.unit__parent_property.length > 0) {
        unit__parent_property_id = Number((values.unit__parent_property[0] as IPropertyAPI).id).toString();
      }

      searchParams.set('page', '1');
      searchParams.set('unit', unit_id);
      searchParams.set('unit__parent_property', unit__parent_property_id);
      searchParams.set('rental_application__status', values.rental_application__status);

      setSearchParams(searchParams, { replace: true });
      setFilterData({
        ...values,
        unit: unit_id,
        unit__parent_property: unit__parent_property_id,
        rental_application__status: values.rental_application__status as RentalStatusType,
      });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('unit');
    searchParams.delete('rental_application__status');
    searchParams.delete('unit__parent_property');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ unit: '', unit__parent_property: '', rental_application__status: '' });

    setFieldValue('unit', []);
    setFieldValue('unit__parent_property', []);
    setFieldValue('rental_application__status', '');

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
        property: propertyLoading || propertyFetching,
      }}
    />
  );
};

interface IFCProps {
  values: IFormValues;
  loadingStates: {
    unit: boolean;
    property: boolean;
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
            name="unit__parent_property"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`RentalApplicationWrapperFormProperty`}
            placeholder={`Select`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.unit__parent_property}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('unit__parent_property', selected);
              } else {
                setFieldValue('unit__parent_property', []);
              }

              setFieldValue('unit', []);
            }}
            labelKey={'name'}
            onBlurChange={() => setFieldTouched('unit__parent_property', true)}
            isValid={touched.unit__parent_property && !errors.unit__parent_property}
            isInvalid={touched.unit__parent_property && !!errors.unit__parent_property}
            disabled={loadingStates.unit || loadingStates.property}
            error={errors.unit__parent_property}
          />
        </Col>
        <Col lg={6}>
          <FilterPaginateInput
            name="unit"
            labelText="Search Unit"
            model_label="property.Unit"
            filter={getSearchFilter(values.unit__parent_property, 'parent_property')}
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
            preload={getSearchFilter(values.unit__parent_property, 'parent_property', true)}
            disabled={values.unit__parent_property.length <= 0 || loadingStates.unit}
            error={errors.unit}
          />
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col lg={6} sm={8}>
          <CustomSelect
            name="rental_application__status"
            labelText="Status"
            value={values.rental_application__status}
            onSelectChange={status => setFieldValue('rental_application__status', status)}
            controlId="ApplicationFilterFormStatus"
            options={[
              { label: 'Draft', value: 'DRAFT' },
              { label: 'Pending', value: 'PENDING' },
              { label: 'Approved', value: 'APPROVED' },
              { label: 'Rejected', value: 'REJECTED' },
              { label: 'On Hold/Waiting', value: 'ON_HOLD_OR_WAITING' },
            ]}
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

export default RentalWrapper;
