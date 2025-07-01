import * as Yup from 'yup';

import formModal from './form-modal';

const {
  formField: {
    late_fee_type,
    base_amount_fee,
    eligible_charges,
    grace_period_type,
    grace_period_days,
    grace_period_until_date,
    start_date,
    end_date,
    daily_amount_per_month_max,
    charge_daily_late_fees,
  },
} = formModal;

const formValidations = [
  Yup.object().shape({
    [late_fee_type.name]: Yup.string()
      .required(`${late_fee_type.requiredErrorMsg}`)
      .oneOf(['flat', 'percentage'], 'Invalid option provided'),
    [base_amount_fee.name]: Yup.string().required(`${base_amount_fee.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [eligible_charges.name]: Yup.string().required(`${eligible_charges.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [grace_period_type.name]: Yup.string().oneOf(
      ['number_of_days', 'till_date_of_month', 'no_grace_period'],
      'Invalid option provided'
    ),
    [grace_period_days.name]: Yup.number().when(grace_period_type.name, {
      is: (value: string) => value === 'number_of_days',
      then: schema => schema.required(`${grace_period_days.requiredErrorMsg}`).positive(),
    }),
    [grace_period_until_date.name]: Yup.number().when(grace_period_type.name, {
      is: (value: string) => value === 'till_date_of_month',
      then: schema => schema.required(`${grace_period_until_date.requiredErrorMsg}`).positive(),
    }),
  }),
  Yup.object().shape({
    [start_date.name]: Yup.date().required(`${start_date.requiredErrorMsg}`),
    [end_date.name]: Yup.date()
      .when(start_date.name, (start_time: Date[], schema) => {
        const date = start_time && start_time.length > 0 && start_time[0];
        if (date) {
          const currentDay = new Date(date.getTime());
          return schema.min(currentDay, 'End date must be after start date');
        } else {
          return schema;
        }
      })
      .required(`${end_date.requiredErrorMsg}`),
  }),
  Yup.object().shape({
    [charge_daily_late_fees.name]: Yup.boolean().oneOf([true, false], 'Message').default(true),
    [daily_amount_per_month_max.name]: Yup.string().when(`charge_daily_late_fees`, {
      is: true,
      then: schema => schema.required(`${daily_amount_per_month_max.requiredErrorMsg}`),
    }),
  }),
];

export default formValidations;
