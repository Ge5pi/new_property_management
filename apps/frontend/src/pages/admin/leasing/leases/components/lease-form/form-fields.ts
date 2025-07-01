const formFields = {
  lease_disabled: {
    name: 'lease_disabled',
    requiredErrorMsg: '',
  },
  property: {
    name: 'property',
    requiredErrorMsg: 'Please select property name',
  },
  applicant: {
    name: 'applicant',
    requiredErrorMsg: 'Please select an applicant',
  },
  unit: {
    name: 'unit',
    requiredErrorMsg: 'Please select unit name',
  },
  lease_type: {
    name: 'lease_type',
    requiredErrorMsg: 'Please select lease type',
  },
  start_date: {
    name: 'start_date',
    requiredErrorMsg: 'Please select start date',
  },
  end_date: {
    name: 'end_date',
    requiredErrorMsg: 'Please select end date',
  },
  due_date: {
    name: 'due_date',
    requiredErrorMsg: 'Please select due date',
  },
  lease_template: {
    name: 'lease_template',
    requiredErrorMsg: 'Please select lease template',
  },
  secondary_tenants: {
    name: 'secondary_tenants',
    first_name: {
      name: 'first_name',
      requiredErrorMsg: 'Please enter tenant first name',
    },
    last_name: {
      name: 'last_name',
      requiredErrorMsg: 'Please enter tenant last name',
    },
    tax_payer_id: {
      name: 'tax_payer_id',
      requiredErrorMsg: 'Please select tenant payer',
    },
    email: {
      name: 'email',
      requiredErrorMsg: 'Please enter tenant email',
    },
    phone_number: {
      name: 'phone_number',
      requiredErrorMsg: 'Please enter tenant phone',
    },
    birthday: {
      name: 'birthday',
      requiredErrorMsg: 'Please enter tenant date of birth',
    },
    description: {
      name: 'description',
      requiredErrorMsg: 'Please enter tenant description',
    },
  },
  rent_cycle: {
    name: 'rent_cycle',
    requiredErrorMsg: 'Please select rent cycle',
  },
  amount: {
    name: 'amount',
    requiredErrorMsg: 'Please enter rent amount',
  },
  gl_account: {
    name: 'gl_account',
    requiredErrorMsg: 'Please select rent account',
  },
  description: {
    name: 'description',
    requiredErrorMsg: 'Please enter rent description',
  },
};

export const leaseDepositFormFields = {
  security_deposit_amount: {
    name: 'security_deposit_amount',
    requiredErrorMsg: 'Please enter security deposit amount',
  },
};

export const leaseChargesFormFields = {
  charge_title: {
    name: 'charge_title',
    requiredErrorMsg: 'Please enter charge title',
  },
  charge_amount: {
    name: 'charge_amount',
    requiredErrorMsg: 'Please enter charge amount',
  },
  charge_account: {
    name: 'charge_account',
    requiredErrorMsg: 'Please select charge account',
  },
  charge_type: {
    name: 'charge_type',
    requiredErrorMsg: 'Please select a valid charge cycle',
  },
  charge_description: {
    name: 'charge_description',
    requiredErrorMsg: 'Please enter charge description',
  },
};

export default formFields;
