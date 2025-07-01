import { FC, FormEvent, ReactElement, useState } from 'react';
import { Button, Col, Form, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { DateRangeInput } from 'core-ui/input-date';

import { ChargeStatus } from 'interfaces/IAccounting';

declare type FilterStatusType = ChargeStatus | '';
declare type IFormValues = {
  date_range: [string, string];
  status: FilterStatusType;
};

declare type IFilterOptions = {
  created_at__gte: string;
  created_at__lte: string;
  status: FilterStatusType;
};
interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterChargeSchema = Yup.object().shape({
  date_range: Yup.array().of(Yup.date()).max(2, 'Invalid start and end date found'),
  status: Yup.string().trim().oneOf(['NOT_VERIFIED', 'VERIFIED', 'PAID', 'UNPAID'], 'Select a valid value'),
});

const ChargesWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    created_at__gte: searchParams.get('created_at__gte') ?? '',
    created_at__lte: searchParams.get('created_at__lte') ?? '',
    status: (searchParams.get('status') as FilterStatusType) ?? '',
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('created_at__gte') && searchParams.has('status') && searchParams.has('created_at__lte')
  );

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      date_range: [
        searchParams.has('created_at__gte') ? (searchParams.get('created_at__gte') as string) : '',
        searchParams.has('created_at__lte') ? (searchParams.get('created_at__lte') as string) : '',
      ] as [string, string],

      status: searchParams.has('status') ? (searchParams.get('status') as FilterStatusType) : '',
    },
    validationSchema: FilterChargeSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (!values.status && (values.date_range.length !== 2 || !values.date_range[0] || !values.date_range[1])) {
        setSubmitting(false);
        return;
      }

      const created_at__gte = values.date_range[0];
      const created_at__lte = values.date_range[1];

      searchParams.set('page', '1');
      searchParams.set('status', values.status);

      searchParams.set('created_at__gte', created_at__gte ?? '');
      searchParams.set('created_at__lte', created_at__lte ?? '');

      setSearchParams(searchParams, { replace: true });
      setFilterData({
        created_at__gte: created_at__gte ?? '',
        created_at__lte: created_at__lte ?? '',

        status: values.status,
      });
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');

    searchParams.delete('created_at__gte');
    searchParams.delete('created_at__lte');

    searchParams.delete('status');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ status: '', created_at__gte: '', created_at__lte: '' });
    setFieldValue('status', '');

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
    />
  );
};

interface IFCProps {
  values: IFormValues;
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
}: IFCProps) => {
  return (
    <FilterMenu
      isEnabled={filterEnabled}
      onSubmit={handleSubmit}
      handleReset={handleReset}
      dropdownMenuClassName="filter-menu-container"
    >
      <Row className="gx-sm-3 gx-0">
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
