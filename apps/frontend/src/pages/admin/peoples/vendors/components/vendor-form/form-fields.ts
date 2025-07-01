const formFields = {
  first_name: {
    name: 'first_name',
    requiredErrorMsg: 'Please enter first name',
  },
  last_name: {
    name: 'last_name',
    requiredErrorMsg: 'Please enter last name',
  },
  company_name: {
    name: 'company_name',
    requiredErrorMsg: 'Please enter company name',
  },
  vendor_type: {
    name: 'vendor_type',
    requiredErrorMsg: 'Please select vendor type',
  },
  gl_account: {
    name: 'gl_account',
    requiredErrorMsg: 'Please select GL Account',
  },
  personal_contact_numbers: {
    name: 'personal_contact_numbers',
    phone: {
      name: 'phone',
      requiredErrorMsg: 'Please enter phone name',
    },
  },
  business_contact_numbers: {
    name: 'business_contact_numbers',
    phone: {
      name: 'phone',
      requiredErrorMsg: 'Please enter phone name',
    },
  },
  personal_emails: {
    name: 'personal_emails',
    email: {
      name: 'email',
      requiredErrorMsg: 'Please enter email',
    },
  },
  business_emails: {
    name: 'business_emails',
    email: {
      name: 'email',
      requiredErrorMsg: 'Please enter email',
    },
  },
  website: {
    name: 'website',
    requiredErrorMsg: 'Please enter a valid website address',
  },
  addresses: {
    name: 'addresses',
    street_address: {
      name: 'street_address',
      requiredErrorMsg: 'Please enter street_address',
    },
    city: {
      name: 'city',
      requiredErrorMsg: 'Please enter city',
    },
    state: {
      name: 'state',
      requiredErrorMsg: 'Please enter state',
    },
    zip: {
      name: 'zip',
      requiredErrorMsg: 'Please enter zip',
    },
    country: {
      name: 'country',
      requiredErrorMsg: 'Please enter country',
    },
  },
  insurance_provide_name: {
    name: 'insurance_provide_name',
    requiredErrorMsg: 'Please enter provider name',
  },
  insurance_policy_number: {
    name: 'insurance_policy_number',
    requiredErrorMsg: 'Please enter policy number',
  },
  insurance_expiry_date: {
    name: 'insurance_expiry_date',
    requiredErrorMsg: 'Please enter expiry date',
  },
  tax_payer_id: {
    name: 'tax_payer_id',
    requiredErrorMsg: 'Please enter tax payer id',
  },
  tax_identity_type: {
    name: 'tax_identity_type',
    requiredErrorMsg: 'Please select tax identity type',
  },
};

export default formFields;
