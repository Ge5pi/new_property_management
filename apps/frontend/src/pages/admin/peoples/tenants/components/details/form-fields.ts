const formFields = {
  formId: 'rentalApplicationForm',
  formField: {
    phone_number: {
      name: 'phone_number',
      phone: {
        name: 'phone',
        requiredErrorMsg: 'Please enter phone',
      },
    },
    emails: {
      name: 'emails',
      email: {
        name: 'email',
        requiredErrorMsg: 'Please enter valid email',
      },
    },
    financial_information: {
      name: 'financial_information',
      bank: {
        name: 'bank',
        requiredErrorMsg: 'Please enter bank name',
      },
      account_name: {
        name: 'name',
        requiredErrorMsg: 'Please enter account name',
      },
      account_number: {
        name: 'account_number',
        requiredErrorMsg: 'Please enter account number',
      },
      account_type: {
        name: 'account_type',
        requiredErrorMsg: 'Please select account type',
      },
    },
    emergency_contacts: {
      name: 'emergency_contacts',
      emergency_contact_name: {
        name: 'name',
        requiredErrorMsg: 'Please enter emergency name',
      },
      emergency_contact_phone_number: {
        name: 'phone_number',
        requiredErrorMsg: 'Please enter emergency phone',
      },
      emergency_contact_relationship: {
        name: 'relationship',
        requiredErrorMsg: 'Please select emergency relationship',
      },
      emergency_contact_address: {
        name: 'address',
        requiredErrorMsg: 'Please enter emergency address',
      },
    },
  },
};

export default formFields;
