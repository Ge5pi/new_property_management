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

import { IPropertyAPI } from 'interfaces/IProperties';
import { IUnitsAPI } from 'interfaces/IUnits';

declare type StatusType = 'Current' | 'Past' | '';
interface IFormValues {
  property_id: Option[];
  unit_id: Option[];
  status: StatusType;
  tenant_name: string;
}

declare type IFilterOptions = {
  property_id: string;
  unit_id: string;
  status: StatusType;
  tenant_name: string;
};

interface IProps {
  children: (data: IFilterOptions | null, FC: JSX.Element) => ReactElement;
}

const FilterFixedAssetSchema = Yup.object().shape({
  property_id: Yup.array().max(1, 'This field is required!'),
  unit_id: Yup.array().max(1, 'This field is required!'),
  status: Yup.string().trim().oneOf(['Current', 'Past'], 'Select a valid value'),
  tenant_name: Yup.string().trim().max(2),
});

const TenantWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    unit_id: searchParams.get('unit') ?? '',
    property_id: searchParams.get('property_id') ?? '',
    status: (searchParams.get('status') as StatusType) ?? '',
    tenant_name: searchParams.get('tenant_name') ?? '',
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('unit_id') &&
      searchParams.has('status') &&
      searchParams.has('property_id') &&
      searchParams.has('tenant_name')
  );

  const {
    data: unit_data,
    isLoading: unitLoading,
    isFetching: unitFetching,
  } = useGetUnitByIdQuery(getValidID(searchParams.get('unit_id')));

  const {
    data: property_data,
    isLoading: propertyLoading,
    isFetching: propertyFetching,
  } = useGetPropertyByIdQuery(getValidID(searchParams.get('property')));

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      unit_id: unit_data ? [unit_data] : ([] as Option[]),
      property_id: property_data ? [property_data] : ([] as Option[]),
      status: searchParams.has('status') ? (searchParams.get('status') as StatusType) : 'Current',
      tenant_name: searchParams.has('tenant_name') ? (searchParams.get('tenant_name') as string) : '',
    },
    validationSchema: FilterFixedAssetSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (
        (!values.property_id || values.property_id.length <= 0) &&
        (!values.unit_id || values.unit_id.length <= 0) &&
        !values.status &&
        !values.tenant_name
      ) {
        setSubmitting(false);
        return;
      }

      let property_id = '';
      if (values.property_id && values.property_id.length > 0) {
        property_id = Number((values.property_id[0] as IPropertyAPI).id).toString();
      }

      let unit_id = '';
      if (values.unit_id && values.unit_id.length > 0) {
        unit_id = Number((values.unit_id[0] as IUnitsAPI).id).toString();
      }

      searchParams.set('page', '1');
      searchParams.set('status', values.status);
      searchParams.set('property_id', property_id);
      searchParams.set('unit_id', unit_id);
      searchParams.set('tenant_name', values.tenant_name);
      setSearchParams(searchParams, { replace: true });
      setFilterData({
        status: values.status,
        property_id: property_id,
        unit_id: unit_id,
        tenant_name: values.tenant_name,
      });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('status');
    searchParams.delete('property_id');
    searchParams.delete('unit_id');
    searchParams.delete('tenant_name');
    setSearchParams(searchParams, { replace: true });
    setFilterData({ status: '', property_id: '', unit_id: '', tenant_name: '' });
    setFieldValue('status', 'Current');
    setFieldValue('tenant_name', '');
    setFieldValue('property_id', []);
    setFieldValue('unit_id', []);
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
        property_id: propertyFetching || propertyLoading,
        unit_id: unitFetching || unitLoading,
      }}
    />
  );
};

interface IFCProps {
  values: IFormValues;
  loadingStates: {
    property_id: boolean;
    unit_id: boolean;
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
            name="property_id"
            model_label="property.Property"
            labelText="Select Property"
            controlId={`TenantWrapperFormProperty`}
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

              setFieldValue('unit_id', []);
            }}
            labelKey={'name'}
            onBlurChange={() => setFieldTouched('property_id', true)}
            isValid={touched.property_id && !errors.property_id}
            isInvalid={touched.property_id && !!errors.property_id}
            disabled={loadingStates.property_id || loadingStates.unit_id}
            error={errors.property_id}
          />
        </Col>
        <Col lg={6}>
          <FilterPaginateInput
            name="unit_id"
            labelText="Search Unit"
            model_label="property.Unit"
            filter={getSearchFilter(values.property_id, 'parent_property')}
            controlId={`TenantWrapperFormUnit`}
            placeholder={`Select Unit`}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            selected={values.unit_id}
            labelKey={'name'}
            onSelectChange={selected => {
              if (selected.length) {
                setFieldValue('unit_id', selected);
              } else {
                setFieldValue('unit_id', []);
              }
            }}
            onBlurChange={() => setFieldTouched('unit_id', true)}
            isValid={touched.unit_id && !errors.unit_id}
            isInvalid={touched.unit_id && !!errors.unit_id}
            preload={getSearchFilter(values.property_id, 'parent_property', true)}
            disabled={values.property_id.length <= 0 || loadingStates.unit_id}
            error={errors.unit_id}
          />
        </Col>
        <Col lg={6}>
          <Form.Group className="mb-3" controlId="DirectorsFormName">
            <Form.Label className="popup-form-labels">Tenant Name starts with</Form.Label>
            <Row>
              <Col lg={4}>
                <Form.Control
                  type="text"
                  name="tenant_name"
                  onChange={ev => setFieldValue('tenant_name', ev.target.value)}
                  onBlur={() => setFieldTouched('tenant_name', true)}
                  isValid={touched.tenant_name && !errors.tenant_name}
                  isInvalid={touched.tenant_name && !!errors.tenant_name}
                  placeholder="A-Z"
                  maxLength={1}
                />
                <Form.Control.Feedback type="invalid">{errors.tenant_name}</Form.Control.Feedback>
              </Col>
            </Row>
          </Form.Group>
        </Col>
        <Col lg={6}>
          <label className="form-label-sm mb-2">Status</label>
          <Row className="gx-0">
            <Col>
              <Row className="gx-0">
                <Form.Group as={Col} xs={'auto'} controlId="FilterDataOptionFormAll">
                  <Form.Check
                    type={'radio'}
                    label={`Current`}
                    className="small text-primary"
                    name="status"
                    value={'Current'}
                    defaultChecked={values.status === 'Current'}
                    onChange={ev => setFieldValue('status', ev.target.value)}
                    onBlur={() => setFieldTouched('status')}
                    isInvalid={touched.status && !!errors.status}
                  />
                </Form.Group>
                <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="FilterDataOptionFormClosed">
                  <Form.Check
                    type={'radio'}
                    label={`Past`}
                    className="small text-primary"
                    name="status"
                    value={'Past'}
                    defaultChecked={values.status === 'Past'}
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

export default TenantWrapper;
