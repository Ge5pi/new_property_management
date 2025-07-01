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

import { getSearchFilter, getValidID } from 'utils/functions';

import { LeaseStatusType } from 'interfaces/IApplications';
import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

declare type IFormValues = {
  unit: Option[];
  unit__parent_property: Option[];
  status: LeaseStatusType | '';
  remaining_days_less_than: number | string;
};

declare type IFilterOptions = {
  unit: string;
  unit__parent_property: string;
  status: LeaseStatusType | '';
  remaining_days_less_than: number | string;
};

interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterLeaseSchema = Yup.object().shape({
  unit: Yup.array().max(1, 'This field is required!'),
  unit__parent_property: Yup.array().max(1, 'This field is required!'),
  status: Yup.string().trim().oneOf(['ACTIVE', 'CLOSED'], 'Select a valid value'),
  remaining_days_less_than: Yup.number().positive(),
});

const LeaseWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    unit: searchParams.get('unit') ?? '',
    unit__parent_property: searchParams.get('unit__parent_property') ?? '',
    status: (searchParams.get('status') ?? '') as LeaseStatusType,
    remaining_days_less_than: searchParams.get('remaining_days_less_than') ?? '',
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('unit__parent_property') ||
      searchParams.has('unit') ||
      searchParams.has('status') ||
      searchParams.has('remaining_days_less_than')
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
      status: (searchParams.get('status') ?? 'ACTIVE') as LeaseStatusType,
      remaining_days_less_than: searchParams.get('remaining_days_less_than') ?? '',
    },
    validationSchema: FilterLeaseSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        (!values.unit__parent_property || values.unit__parent_property.length <= 0) &&
        (!values.unit || values.unit.length <= 0) &&
        !values.status &&
        !values.remaining_days_less_than
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
      searchParams.set('status', values.status);
      searchParams.set('remaining_days_less_than', values.remaining_days_less_than);

      setSearchParams(searchParams, { replace: true });
      setFilterData({
        ...values,
        unit: unit_id,
        unit__parent_property: unit__parent_property_id,
        status: values.status as LeaseStatusType,
        remaining_days_less_than: values.remaining_days_less_than,
      });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('unit');
    searchParams.delete('status');
    searchParams.delete('unit__parent_property');
    searchParams.delete('remaining_days_less_than');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ unit: '', unit__parent_property: '', status: '', remaining_days_less_than: '' });

    setFieldValue('unit', []);
    setFieldValue('unit__parent_property', []);

    setFieldValue('status', 'ACTIVE');
    setFieldValue('remaining_days_less_than', '');

    setFilterStatus(false);
  };

  return children(
    filterData,
    <FilterMenuComponent
      {...rest}
      values={values}
      setFieldValue={setFieldValue}
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
            controlId={`LeaseWrapperFormProperty`}
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
        <Col lg={6}>
          <Form.Group className="mb-3" controlId="DirectorsFormPhone">
            <Form.Label className="popup-form-labels">Remaining Days (Less Than)</Form.Label>
            <Form.Control
              type="number"
              placeholder="1"
              min={0}
              onChange={ev => setFieldValue('remaining_days_less_than', ev.target.value)}
              onBlur={() => setFieldTouched('remaining_days_less_than', true)}
              isValid={touched.remaining_days_less_than && !errors.remaining_days_less_than}
              isInvalid={touched.remaining_days_less_than && !!errors.remaining_days_less_than}
            />
            <Form.Control.Feedback type="invalid">{errors.remaining_days_less_than}</Form.Control.Feedback>
          </Form.Group>
        </Col>
      </Row>
      <Row className="gx-sm-4 gx-0">
        <Col lg={12}>
          <p className="form-label-sm mb-2">Status</p>
          <Row className="gx-0">
            <Col>
              <Row className="gx-0">
                <Form.Group as={Col} xs={'auto'} controlId="FilterDataOptionFormActive">
                  <Form.Check
                    type={'radio'}
                    label={`Active`}
                    className="small text-primary"
                    name="status"
                    value={'ACTIVE'}
                    defaultChecked={values.status === 'ACTIVE'}
                    onChange={ev => setFieldValue('status', ev.target.value)}
                    onBlur={() => setFieldTouched('status')}
                    isInvalid={touched.status && !!errors.status}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="FilterDataOptionFormCLOSED">
                  <Form.Check
                    type={'radio'}
                    label={`Closed`}
                    className="small text-primary"
                    name="status"
                    value={'CLOSED'}
                    defaultChecked={values.status === 'CLOSED'}
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

export default LeaseWrapper;
