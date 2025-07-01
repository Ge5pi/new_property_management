import { useState } from 'react';
import { Col, Form, Row } from 'react-bootstrap';

import { clsx } from 'clsx';
import { Formik, FormikValues, useFormikContext } from 'formik';

import useResponse from 'services/api/hooks/useResponse';
import { useUpdatePropertyLateFeeInformationMutation } from 'services/api/properties';
import { BaseQueryError } from 'services/api/types/rtk-query';

import { CustomStepper } from 'components/custom-stepper';
import ActionButtons from 'components/custom-stepper/action-buttons';
import { Popup } from 'components/popup';

import { GroupedField } from 'core-ui/grouped-field';
import { InputDate } from 'core-ui/input-date';
import { ProviderHOC } from 'core-ui/redux-provider/provider-hoc';
import { SwalExtended } from 'core-ui/sweet-alert';

import { displayDate, renderFormError } from 'utils/functions';

import { GracePeriodType } from 'interfaces/IGeneral';
import { ILateFeePolicy } from 'interfaces/IProperties';

import formModal from './form-model/form-modal';
import formValidationSchema from './form-model/form-validation';

interface IProps {
  late_id: string | number;
  late_fee_policy: Partial<ILateFeePolicy>;
}

const steps = ['Fee Type', 'Charges', 'Period', 'Beginning', 'Optionals', 'Confirmation'];
const { formField } = formModal;

const getGracePeriod = (selected_g_type: GracePeriodType, g_type?: GracePeriodType, value?: number) => {
  if (g_type && value) {
    if (g_type === selected_g_type) return value;
  }
  return '';
};

const LateFeeModal = ({ late_fee_policy, late_id }: IProps) => {
  const [index, setIndex] = useState(1);
  const currentValidationSchema = formValidationSchema[index - 1];
  const isLastStep = index === steps.length;

  const [
    updateLateFeePolicy,
    { isSuccess: isUpdateLateFeePolicySuccess, isError: isUpdateLateFeePolicyError, error: updateLateFeePolicyError },
  ] = useUpdatePropertyLateFeeInformationMutation();

  useResponse({
    isSuccess: isUpdateLateFeePolicySuccess,
    successTitle: 'Late Fee Policy Information has been updated!',
    isError: isUpdateLateFeePolicyError,
    error: updateLateFeePolicyError,
  });

  const prevButton = () => {
    setIndex(prevIndex => prevIndex - 1);
  };

  const handleFormSubmission = async (values: FormikValues) => {
    let grace_period = null;
    switch (values.grace_period_type) {
      case 'number_of_days':
        grace_period = values.grace_period_days;
        break;
      case 'till_date_of_month':
        grace_period = values.grace_period_until_date;
        break;
      default:
        break;
    }

    return await updateLateFeePolicy({
      ...values,
      id: Number(late_id),
      grace_period,
    }).then(result => {
      if (result.data) SwalExtended.close();
      else return result.error as BaseQueryError;
    });
  };

  return (
    <Formik
      initialValues={{
        [formField.late_fee_type.name]: late_fee_policy?.late_fee_type ?? '',
        [formField.base_amount_fee.name]: late_fee_policy?.base_amount_fee ?? '',
        [formField.eligible_charges.name]: late_fee_policy?.eligible_charges ?? '',
        [formField.grace_period_type.name]: late_fee_policy?.grace_period_type ?? ('number_of_days' as GracePeriodType),

        [formField.grace_period_days.name]: getGracePeriod(
          'number_of_days',
          late_fee_policy.grace_period_type,
          late_fee_policy.grace_period
        ),
        [formField.grace_period_until_date.name]: getGracePeriod(
          'till_date_of_month',
          late_fee_policy.grace_period_type,
          late_fee_policy.grace_period
        ),

        [formField.start_date.name]: late_fee_policy?.start_date ?? '',
        [formField.end_date.name]: late_fee_policy?.end_date ?? '',
        [formField.daily_amount_per_month_max.name]: late_fee_policy?.daily_amount_per_month_max ?? '',
        [formField.charge_daily_late_fees.name]: late_fee_policy?.charge_daily_late_fees ?? false,
      }}
      enableReinitialize
      validationSchema={currentValidationSchema}
      onSubmit={(values, { setSubmitting, setTouched, setFieldError }) => {
        if (isLastStep) {
          handleFormSubmission(values)
            .then(error => {
              if (error && error.status === 400 && error.data) {
                renderFormError(error.data, setFieldError);
              }
            })
            .finally(() => {
              setSubmitting(false);
              SwalExtended.hideLoading();
            });
        } else {
          setTouched({});
          setIndex(prev => prev + 1);
          setSubmitting(false);
        }
      }}
    >
      {({ isSubmitting, handleSubmit }) => (
        <Popup
          title={'Late Fee Policy'}
          subtitle={'Edit your late fee policy'}
          onSubmit={handleSubmit}
          isSubmitting={isSubmitting}
          actionBtn={false}
        >
          <CustomStepper
            active={index}
            steps={steps}
            actions={
              <ActionButtons currentItem={index} disabled={isSubmitting} totalItems={6} prevButton={prevButton} />
            }
          >
            <Step01FeeType />

            <Step02Charges />

            <Step03Period />

            <Step04Beginning />

            <Step05Optional />

            <Step06Confirmation />
          </CustomStepper>
        </Popup>
      )}
    </Formik>
  );
};

const Step01FeeType = () => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<ILateFeePolicy>();
  const { late_fee_type, base_amount_fee } = formField;

  return (
    <div className="mb-4">
      <p className="rent-group-label text-primary small">I charge</p>
      <Row className="gx-0 mb-3">
        <Form.Group as={Col} xs={'auto'} controlId="FeeTypeFormFlat">
          <Form.Check
            type={'radio'}
            label={`Flat amount`}
            className="small text-primary"
            value={'flat'}
            defaultChecked={values.late_fee_type === 'flat'}
            name={late_fee_type.name}
            onChange={ev => setFieldValue(late_fee_type.name, ev.target.value)}
            onBlur={() => setFieldTouched(late_fee_type.name)}
            isInvalid={touched.late_fee_type && !!errors.late_fee_type}
          />
        </Form.Group>
        <Form.Group as={Col} xs={'auto'} className="ms-3" controlId="FeeTypeFormPercentage">
          <Form.Check
            type={'radio'}
            label={`Percentage`}
            value={'percentage'}
            defaultChecked={values.late_fee_type === 'percentage'}
            className="small text-primary"
            name={late_fee_type.name}
            onChange={ev => setFieldValue(late_fee_type.name, ev.target.value)}
            onBlur={() => setFieldTouched(late_fee_type.name)}
            isInvalid={touched.late_fee_type && !!errors.late_fee_type}
          />
        </Form.Group>
      </Row>
      <Row className="gx-0">
        <Col lg={4} md={6} sm={8}>
          <GroupedField
            wrapperClass="mb-1"
            labelClass="popup-form-labels"
            controlId="FeeTypeFormIncreaseFee"
            icon={values.late_fee_type === 'flat' ? '$' : '%'}
            position="end"
            min="0"
            type="number"
            step={0.1}
            placeholder="50"
            name={base_amount_fee.name}
            value={values.base_amount_fee}
            onChange={ev => setFieldValue(base_amount_fee.name, ev.target.value)}
            onBlur={() => setFieldTouched(base_amount_fee.name)}
            isValid={touched.base_amount_fee && !errors.base_amount_fee}
            isInvalid={touched.base_amount_fee && !!errors.base_amount_fee}
            disabled={!values.late_fee_type || Boolean(errors.late_fee_type)}
            error={errors.base_amount_fee}
          />
        </Col>
      </Row>
    </div>
  );
};

const Step02Charges = () => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<ILateFeePolicy>();
  const { eligible_charges } = formField;

  return (
    <div className="mb-4">
      <p className="rent-group-label text-primary small">Select eligible charges</p>
      <Row className="gx-0">
        <Form.Group as={Col} className="mb-3" xs={12} controlId="ChargesFormEveryCharge">
          <Form.Check
            type={'radio'}
            label={`Every charge`}
            className="small text-primary"
            value={'every_charge'}
            defaultChecked={values.eligible_charges === 'every_charge'}
            name={eligible_charges.name}
            onChange={ev => setFieldValue(eligible_charges.name, ev.target.value)}
            onBlur={() => setFieldTouched(eligible_charges.name)}
            isInvalid={touched.eligible_charges && !!errors.eligible_charges}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3" xs={12} controlId="ChargesFormRecurring">
          <Form.Check
            type={'radio'}
            label={`All recurring charges`}
            className="small text-primary"
            value={'all_recurring_charges'}
            defaultChecked={values.eligible_charges === 'all_recurring_charges'}
            name={eligible_charges.name}
            onChange={ev => setFieldValue(eligible_charges.name, ev.target.value)}
            onBlur={() => setFieldTouched(eligible_charges.name)}
            isInvalid={touched.eligible_charges && !!errors.eligible_charges}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3" xs={12} controlId="ChargesFormRecurringRent">
          <Form.Check
            type={'radio'}
            label={`Only recurring rent`}
            className="small text-primary"
            value={'only_recurring_rent'}
            defaultChecked={values.eligible_charges === 'only_recurring_rent'}
            name={eligible_charges.name}
            onChange={ev => setFieldValue(eligible_charges.name, ev.target.value)}
            onBlur={() => setFieldTouched(eligible_charges.name)}
            isInvalid={touched.eligible_charges && !!errors.eligible_charges}
          />
        </Form.Group>
        <Col xs={12}>
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.eligible_charges })}>
            {errors.eligible_charges}
          </Form.Control.Feedback>
        </Col>
      </Row>
    </div>
  );
};

const Step03Period = () => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<
    ILateFeePolicy & { grace_period_days?: number; grace_period_until_date?: number }
  >();
  const { grace_period_type, grace_period_days, grace_period_until_date } = formField;

  return (
    <div className="mb-4">
      <p className="rent-group-label text-primary small">Set your grace period length</p>
      <Row className="gx-0">
        <Form.Group as={Col} className="mb-3" xs={12} controlId="PeriodDelayFormChargeLate">
          <Form.Check
            type={'radio'}
            label={
              <span className="row gx-0 align-items-center">
                <span className="col-auto">Tenants have</span>
                <Form.Control
                  min="0"
                  className={clsx('col-auto mx-2', { 'd-none': values.grace_period_type === 'till_date_of_month' })}
                  type="number"
                  size="sm"
                  placeholder="1"
                  name={grace_period_days.name}
                  disabled={values.grace_period_type !== 'number_of_days'}
                  readOnly={values.grace_period_type !== 'number_of_days'}
                  value={values.grace_period_days}
                  onChange={ev => setFieldValue(grace_period_days.name, ev.target.value)}
                  onBlur={() => setFieldTouched(grace_period_days.name)}
                  isValid={touched.grace_period_days && !errors.grace_period_days}
                  isInvalid={touched.grace_period_days && !!errors.grace_period_days}
                  style={{
                    width: 75,
                  }}
                />
                <span className="col-auto">
                  <span className="mx-1">days until they are charges a late fee</span>
                </span>
              </span>
            }
            className="small text-primary"
            value={'number_of_days'}
            defaultChecked={values.grace_period_type === 'number_of_days'}
            name={grace_period_type.name}
            onChange={ev => setFieldValue(grace_period_type.name, ev.target.value)}
            onBlur={() => setFieldTouched(grace_period_type.name)}
            isInvalid={touched.grace_period_type && !!errors.grace_period_type}
          />
        </Form.Group>
        <Form.Group as={Col} className="mb-3" xs={12} controlId="PeriodDelayFormRecurring">
          <Form.Check
            type={'radio'}
            label={
              <span className="row gx-0 align-items-center">
                <span className="col-auto">Tenants have until</span>
                <Form.Control
                  min="0"
                  size="sm"
                  type="number"
                  className={clsx('col-auto mx-2', { 'd-none': values.grace_period_type === 'number_of_days' })}
                  placeholder="1"
                  disabled={values.grace_period_type !== 'till_date_of_month'}
                  readOnly={values.grace_period_type !== 'till_date_of_month'}
                  name={grace_period_until_date.name}
                  value={values.grace_period_until_date}
                  onChange={ev => setFieldValue(grace_period_until_date.name, ev.target.value)}
                  onBlur={() => setFieldTouched(grace_period_until_date.name)}
                  isValid={touched.grace_period_until_date && !errors.grace_period_until_date}
                  isInvalid={touched.grace_period_until_date && !!errors.grace_period_until_date}
                  style={{
                    width: 75,
                  }}
                />
                <span className="col-auto">
                  <span className="mx-1">day of the following month</span>
                </span>
              </span>
            }
            className="small text-primary"
            value={'till_date_of_month'}
            defaultChecked={values.grace_period_type === 'till_date_of_month'}
            name={grace_period_type.name}
            onChange={ev => setFieldValue(grace_period_type.name, ev.target.value)}
            onBlur={() => setFieldTouched(grace_period_type.name)}
            isInvalid={touched.grace_period_type && !!errors.grace_period_type}
          />
        </Form.Group>
        <Col xs={12}>
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.grace_period_type })}>
            {errors.grace_period_type}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.grace_period_days })}>
            {errors.grace_period_days}
          </Form.Control.Feedback>
          <Form.Control.Feedback type="invalid" className={clsx({ 'd-block': errors.grace_period_until_date })}>
            {errors.grace_period_until_date}
          </Form.Control.Feedback>
        </Col>
      </Row>
    </div>
  );
};

const Step04Beginning = () => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<ILateFeePolicy>();
  const { start_date, end_date } = formField;

  return (
    <div className="mb-4">
      <p className="rent-group-label text-primary small">Choose when the policy will begin</p>
      <Row className="gx-sm-3 gx-0">
        <Col lg={4} sm={5}>
          <InputDate
            labelText="Date"
            name={start_date.name}
            controlId="BeginningFormFromDate"
            classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
            value={values.start_date}
            onDateSelection={date => setFieldValue(start_date.name, date)}
            onBlur={() => setFieldTouched(start_date.name)}
            isValid={touched.start_date && !errors.start_date}
            isInvalid={touched.start_date && !!errors.start_date}
            error={errors.start_date}
          />
        </Col>
        <Col lg={4} sm={5}>
          <InputDate
            name={end_date.name}
            labelText={'Till Date'}
            controlId="BeginningFormTillDate"
            classNames={{ wrapperClass: 'mb-3', labelClass: 'popup-form-labels' }}
            value={values.end_date}
            onDateSelection={date => setFieldValue(end_date.name, date)}
            minDate={new Date(values.start_date)}
            onBlur={() => setFieldTouched(end_date.name)}
            isValid={touched.end_date && !errors.end_date}
            isInvalid={touched.end_date && !!errors.end_date}
            error={errors.end_date}
          />
        </Col>
      </Row>
    </div>
  );
};

const Step05Optional = () => {
  const { values, touched, errors, setFieldValue, setFieldTouched } = useFormikContext<ILateFeePolicy>();
  const { charge_daily_late_fees, daily_amount_per_month_max } = formField;

  return (
    <div className="mb-4">
      <p className="rent-group-label text-primary small">Choose any optional settings</p>
      <Row className="gx-sm-3 gx-0 align-items-start justify-content-sm-between">
        <Col xl={6} lg={8} md={10}>
          <Row className="gx-sm-1 gx-0">
            <Col sm={6}>
              <Form.Group className="mb-3" controlId="OptionalSettingsFormDailyLate">
                <Form.Check
                  type={'checkbox'}
                  label={`I charge daily late fee`}
                  className="small text-primary"
                  defaultChecked={values.charge_daily_late_fees}
                  name={charge_daily_late_fees.name}
                  onChange={() => setFieldValue(charge_daily_late_fees.name, !values.charge_daily_late_fees)}
                  onBlur={() => setFieldTouched(charge_daily_late_fees.name)}
                  isInvalid={touched.charge_daily_late_fees && !!errors.charge_daily_late_fees}
                />
              </Form.Group>
            </Col>
          </Row>
        </Col>
        <Col lg={4} md={6}>
          <GroupedField
            wrapperClass="mb-3"
            labelClass="popup-form-labels"
            controlId="OptionalSettingsFormExceed"
            wrapperStyle={{ width: 136 }}
            icon={'$'}
            position="end"
            label="Daily late fee cannot exceed"
            min="0"
            type="number"
            step={0.1}
            placeholder="50"
            name={daily_amount_per_month_max.name}
            value={values.daily_amount_per_month_max}
            onChange={ev => setFieldValue(daily_amount_per_month_max.name, ev.target.value)}
            onBlur={() => setFieldTouched(daily_amount_per_month_max.name)}
            isValid={touched.daily_amount_per_month_max && !errors.daily_amount_per_month_max}
            isInvalid={touched.daily_amount_per_month_max && !!errors.daily_amount_per_month_max}
            error={errors.daily_amount_per_month_max}
          />
        </Col>
      </Row>
    </div>
  );
};

const Step06Confirmation = () => {
  const { values } = useFormikContext<ILateFeePolicy>();

  return (
    <div className="mb-4">
      <p className="rent-group-label text-primary small">Late fee policy will be effective for the following period</p>
      <Row className="gx-sm-3 gx-0 align-items-center mb-4">
        <Col xs={'auto'}>
          <span className="text-primary">{displayDate(values.start_date)}</span>
        </Col>
        <Col sm={1} xs={3} className="text-center">
          Till
        </Col>
        <Col xs={'auto'}>
          <span className="text-primary">{displayDate(values.end_date)}</span>
        </Col>
      </Row>
    </div>
  );
};

export default ProviderHOC(LateFeeModal);
