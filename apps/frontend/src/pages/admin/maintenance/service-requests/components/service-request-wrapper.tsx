import { FC, FormEvent, ReactElement, useState } from 'react';
import { Button, Col, Row } from 'react-bootstrap';
import { useSearchParams } from 'react-router-dom';

import { FormikErrors, FormikTouched, useFormik } from 'formik';
import * as Yup from 'yup';

import { FilterMenu } from 'components/filter-menu';
import { SubmitBtn } from 'components/submit-button';

import { CustomSelect } from 'core-ui/custom-select';

import { IServiceRequestFilter, PriorityType } from 'interfaces/IServiceRequests';
import { WorkOrderStatus, WorkOrderType } from 'interfaces/IWorkOrders';

interface IProps {
  children: (data: IServiceRequestFilter, FC: JSX.Element) => ReactElement;
}

const FilterServiceRequestSchema = Yup.object().shape({
  priority: Yup.string().trim().oneOf(['URGENT', 'NORMAL', 'LOW']),
  order_type: Yup.string().trim().oneOf(['INTERNAL', 'RESIDENT', 'UNIT_TURN']),
  work_order_status: Yup.string().trim().oneOf(['OPEN', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED']),
});

const ServiceRequestWrapper: FC<IProps> = ({ children }) => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filterBy, setFilterData] = useState<IServiceRequestFilter>(() => {
    let data = { priority: '', work_order_status: '', order_type: '' };
    const priorityType = searchParams.get('priority') as PriorityType;
    if (priorityType && typeof priorityType === 'string') {
      data = { ...data, priority: priorityType };
    }

    const orderType = searchParams.get('order_type') as WorkOrderType;
    if (orderType && typeof orderType === 'string') {
      data = { ...data, order_type: orderType };
    }

    const currentStatus = searchParams.get('work_order_status') as WorkOrderStatus;
    if (currentStatus && typeof currentStatus === 'string') {
      data = { ...data, work_order_status: currentStatus };
    }

    return data as IServiceRequestFilter;
  });

  const [filterEnabled, setFilterStatus] = useState(
    searchParams.has('priority') || searchParams.has('order_type') || searchParams.has('work_order_status')
  );

  const { values, setFieldValue, ...rest } = useFormik({
    initialValues: {
      priority: filterBy.priority,
      order_type: filterBy.order_type,
      work_order_status: filterBy.work_order_status,
    },
    validationSchema: FilterServiceRequestSchema,
    enableReinitialize: true,
    onSubmit: (values, { setSubmitting }) => {
      if (!values.work_order_status && !values.order_type && !values.priority) {
        setSubmitting(false);
        return;
      }

      if (values.priority) {
        searchParams.set('priority', values.priority);
      }

      if (values.order_type) {
        searchParams.set('order_type', values.order_type);
      }

      if (values.work_order_status) {
        searchParams.set('work_order_status', values.work_order_status ?? '');
      }

      searchParams.set('page', '1');
      setSearchParams(searchParams, { replace: true });
      setFilterData(values);
      setFilterStatus(true);
      setSubmitting(false);
    },
  });

  const onReset = () => {
    searchParams.set('page', '1');
    searchParams.delete('priority');
    searchParams.delete('order_type');
    searchParams.delete('work_order_status');
    setSearchParams(searchParams, { replace: true });
    setFilterData({ priority: '', order_type: '', work_order_status: '' });
    setFieldValue('priority', '');
    setFieldValue('order_type', '');
    setFieldValue('work_order_status', '');
    setFilterStatus(false);
  };

  return children(
    filterBy,
    <FilterMenuComponent
      {...rest}
      values={values}
      setFieldValue={setFieldValue}
      filterEnabled={filterEnabled}
      handleReset={onReset}
    />
  );
};

interface IFCProps {
  values: IServiceRequestFilter;
  setFieldValue: (
    field: string,
    value: unknown,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<IServiceRequestFilter>>;
  setFieldTouched: (
    field: string,
    touched?: boolean | undefined,
    shouldValidate?: boolean | undefined
  ) => Promise<void> | Promise<FormikErrors<IServiceRequestFilter>>;
  handleSubmit: (e?: FormEvent<HTMLFormElement>) => void;
  handleReset: (e?: unknown) => void;
  errors: FormikErrors<IServiceRequestFilter>;
  touched: FormikTouched<IServiceRequestFilter>;
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
      <Row className="gx-lg-4 gx-3 gx-0">
        <Col sm={6}>
          <CustomSelect
            labelText="Priority"
            controlId={`ServiceRequestFilterFormPriority`}
            placeholder="---"
            options={[
              { value: 'LOW', label: 'Low' },
              { value: 'NORMAL', label: 'Normal' },
              { value: 'URGENT', label: 'Urgent' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            name="priority"
            value={values.priority}
            onSelectChange={value => setFieldValue('priority', value)}
            onBlurChange={() => setFieldTouched('priority', true)}
            isValid={touched.priority && !errors.priority}
            isInvalid={touched.priority && !!errors.priority}
            error={errors.priority}
          />
        </Col>
        <Col sm={6}>
          <CustomSelect
            labelText="Order Type"
            controlId={`ServiceRequestFilterFormOrderType`}
            placeholder="---"
            options={[
              { value: 'INTERNAL', label: 'Internal' },
              { value: 'RESIDENT', label: 'Resident' },
              { value: 'UNIT_TURN', label: 'Unit Turn' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            name="order_type"
            value={values.order_type}
            onSelectChange={value => setFieldValue('order_type', value)}
            onBlurChange={() => setFieldTouched('order_type', true)}
            isValid={touched.order_type && !errors.order_type}
            isInvalid={touched.order_type && !!errors.order_type}
            error={errors.order_type}
          />
        </Col>
        <Col sm={6}>
          <CustomSelect
            labelText="Work Order Status"
            controlId={`ServiceRequestFilterFormWorkStatus`}
            placeholder="---"
            options={[
              { value: 'OPEN', label: 'Open' },
              { value: 'ASSIGNED', label: 'Assigned' },
              { value: 'UNASSIGNED', label: 'Unassigned' },
              { value: 'COMPLETED', label: 'Completed' },
            ]}
            classNames={{
              labelClass: 'popup-form-labels',
              wrapperClass: 'mb-3',
            }}
            name="work_order_status"
            value={values.work_order_status}
            onSelectChange={value => setFieldValue('work_order_status', value)}
            onBlurChange={() => setFieldTouched('work_order_status', true)}
            isValid={touched.work_order_status && !errors.work_order_status}
            isInvalid={touched.work_order_status && !!errors.work_order_status}
            error={errors.work_order_status}
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

export default ServiceRequestWrapper;
