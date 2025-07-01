const formFields = {
  formId: 'lateFeeForm',
  formField: {
    late_fee_type: {
      name: 'late_fee_type',
      requiredErrorMsg: 'Please select one of the types',
    },
    base_amount_fee: {
      name: 'base_amount_fee',
      requiredErrorMsg: 'Please enter an amount',
    },
    eligible_charges: {
      name: 'eligible_charges',
      requiredErrorMsg: 'Please select eligible charges',
    },
    grace_period_type: {
      name: 'grace_period_type',
      requiredErrorMsg: 'Please set a grace period length',
    },
    grace_period: {
      name: 'grace_period',
      requiredErrorMsg: 'Please enter grace period',
    },
    grace_period_days: {
      name: 'grace_period_days',
      requiredErrorMsg: 'This field is required!',
    },
    grace_period_until_date: {
      name: 'grace_period_until_date',
      requiredErrorMsg: 'This field is required!',
    },
    start_date: {
      name: 'start_date',
      requiredErrorMsg: 'Please specify start date',
    },
    end_date: {
      name: 'end_date',
      requiredErrorMsg: 'Please specify end date',
    },
    daily_amount_per_month_max: {
      name: 'daily_amount_per_month_max',
      requiredErrorMsg: 'This field is required!',
    },
    charge_daily_late_fees: {
      name: 'charge_daily_late_fees',
    },
  },
};

export default formFields;
