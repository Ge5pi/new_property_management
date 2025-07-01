import { FC, FormEvent, ReactElement, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { InputDate } from 'core-ui/input-date';

declare type IFilterOptions = {
  created_at: string;
  due_date: string;
};

interface IProps {
  children: (data: IFilterOptions, FC: JSX.Element) => ReactElement;
}

const FilterInvoiceSchema = Yup.object().shape({
  created_at: Yup.date(),
  due_date: Yup.date().when('created_at', (start_time: Date[], schema) => {
    const date = start_time && start_time.length > 0 && start_time[0];
    if (date) {
      const currentDay = new Date(date.getTime());
      return schema.min(currentDay, 'End date must be after start date');
    } else {
      return schema;
    }
  }),
});

const InvoiceWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterData, setFilterData] = useState<IFilterOptions>({
    created_at: searchParams.get('created_at') ?? '',
    due_date: searchParams.get('due_date') ?? '',
  });

  const [filterEnabled, setFilterStatus] = useState(
    () => searchParams.has('created_at') && searchParams.has('due_date')
  );

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      created_at: searchParams.has('created_at') ? (searchParams.get('created_at') as string) : '',
      due_date: searchParams.has('due_date') ? (searchParams.get('due_date') as string) : '',
    },
    validationSchema: FilterInvoiceSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (!values.created_at && !values.due_date) {
        setSubmitting(false);
        return;
      }

      searchParams.set('page', '1');
      searchParams.set('created_at', values.created_at ?? '');
      searchParams.set('due_date', values.due_date ?? '');

      setSearchParams(searchParams, { replace: true });
      setFilterData({
        created_at: values.created_at ?? '',
        due_date: values.due_date ?? '',
      });

      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('created_at');
    searchParams.delete('due_date');

    setSearchParams(searchParams, { replace: true });
    setFilterData({ created_at: '', due_date: '' });
    setFieldValue('created_at', '');
    setFieldValue('due_date', '');

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
  values: IFilterOptions;
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<IFilterOptions>>;
  setFieldTouched: (
    field: string,
    touched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<IFilterOptions>>;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
  handleReset: (e?: unknown) => void;
  errors: FormikErrors<IFilterOptions>;
  touched: FormikTouched<IFilterOptions>;
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
        <Col sm={6}>
          <div id="invoice-rent-date-filter-picker">
            <InputDate
              labelText={'Rent Month'}
              name={'created_at'}
              portalId="invoice-rent-date-filter-picker"
              controlId="BeginningFormFromDate"
              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
              value={values.created_at}
              onDateSelection={date => setFieldValue('created_at', date)}
              onBlur={() => setFieldTouched('created_at')}
              isValid={touched.created_at && !errors.created_at}
              isInvalid={touched.created_at && !!errors.created_at}
              error={errors.created_at}
            />
          </div>
        </Col>
        <Col sm={6}>
          <div id="invoice-due-date-filter-picker">
            <InputDate
              name={'due_date'}
              labelText={'Due Date'}
              controlId="BeginningFormTillDate"
              portalId="invoice-due-date-filter-picker"
              classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
              value={values.due_date}
              onDateSelection={date => setFieldValue('due_date', date)}
              minDate={new Date(values.created_at)}
              onBlur={() => setFieldTouched('due_date')}
              isValid={touched.due_date && !errors.due_date}
              isInvalid={touched.due_date && !!errors.due_date}
              error={errors.due_date}
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

export default InvoiceWrapper;
