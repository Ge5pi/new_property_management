const formFields = {
  formId: 'rentalApplicationForm',
  formField: {
    desired_move_in_date: {
      name: 'desired_move_in_date',
      requiredErrorMsg: 'Please select move in date',
    },
    legal_first_name: {
      name: 'legal_first_name',
      requiredErrorMsg: 'Please enter First Name',
    },
    middle_name: {
      name: 'middle_name',
      requiredErrorMsg: 'Please enter Middle Name',
    },
    legal_last_name: {
      name: 'legal_last_name',
      requiredErrorMsg: 'Please enter Last Name',
    },
    application_type: {
      name: 'application_type',
      requiredErrorMsg: 'Please select applicant type',
    },
    birthday: {
      name: 'birthday',
      requiredErrorMsg: 'Please select date of birth',
    },
    ssn_or_tin: {
      name: 'ssn_or_tin',
      requiredErrorMsg: 'Please enter SSN or TIN',
    },
    driving_license_number: {
      name: 'driving_license_number',
      requiredErrorMsg: 'Please enter driving license',
    },
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
    residential_history: {
      name: 'residential_history',
      current_address: {
        name: 'current_address',
        requiredErrorMsg: 'Please enter address',
      },
      current_address_2: {
        name: 'current_address_2',
        requiredErrorMsg: 'Please enter address 2',
      },
      current_country: {
        name: 'current_country',
        requiredErrorMsg: 'Please select country',
      },
      current_city: {
        name: 'current_city',
        requiredErrorMsg: 'Please select city',
      },
      current_state: {
        name: 'current_state',
        requiredErrorMsg: 'Please select city',
      },
      current_zip_code: {
        name: 'current_zip_code',
        requiredErrorMsg: 'Please enter zip',
      },
      resident_from: {
        name: 'resident_from',
        requiredErrorMsg: 'Please select resided from',
      },
      resident_to: {
        name: 'resident_to',
        requiredErrorMsg: 'Please select resided to',
      },
      monthly_rent: {
        name: 'monthly_rent',
        requiredErrorMsg: 'Please enter monthly rent',
      },
      landlord_name: {
        name: 'landlord_name',
        requiredErrorMsg: 'Please enter landlord name',
      },
      landlord_phone_number: {
        name: 'landlord_phone_number',
        requiredErrorMsg: 'Please enter landlord phone',
      },
      landlord_email: {
        name: 'landlord_email',
        requiredErrorMsg: 'Please enter landlord valid email',
      },
      reason_of_leaving: {
        name: 'reason_of_leaving',
        requiredErrorMsg: 'Please enter reason for leaving',
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
    employer_name: {
      name: 'employer_name',
      requiredErrorMsg: 'Please enter employer name',
    },
    employer_phone_number: {
      name: 'employer_phone_number',
      requiredErrorMsg: 'Please enter employer phone',
    },
    employer_address: {
      name: 'employer_address',
      requiredErrorMsg: 'Please enter employer address',
    },
    employment_country: {
      name: 'employment_country',
      requiredErrorMsg: 'Please select employer country',
    },
    employment_city: {
      name: 'employment_city',
      requiredErrorMsg: 'Please select employer city',
    },
    employment_zip_code: {
      name: 'employment_zip_code',
      requiredErrorMsg: 'Please enter employer zip',
    },
    monthly_salary: {
      name: 'monthly_salary',
      requiredErrorMsg: 'Please enter employer monthly salary',
    },
    position_held: {
      name: 'position_held',
      requiredErrorMsg: 'Please select employer held',
    },
    years_worked: {
      name: 'years_worked',
      requiredErrorMsg: 'Please enter employer years worked',
    },
    supervisor_name: {
      name: 'supervisor_name',
      requiredErrorMsg: 'Please enter employer superior name',
    },
    supervisor_phone_number: {
      name: 'supervisor_phone_number',
      requiredErrorMsg: 'Please enter employer superior phone number',
    },
    supervisor_title: {
      name: 'supervisor_title',
      requiredErrorMsg: 'Please enter employer superior title',
    },
    supervisor_email: {
      name: 'supervisor_email',
      requiredErrorMsg: 'Please enter employer superior valid email',
    },
    additional_income: {
      name: 'additional_income',
      monthly_income: {
        name: 'monthly_income',
        requiredErrorMsg: 'Please enter monthly income',
      },
      source_of_income: {
        name: 'source_of_income',
        requiredErrorMsg: 'Please enter source',
      },
    },
    dependents: {
      name: 'dependents',
      first_name: {
        name: 'first_name',
        requiredErrorMsg: 'Please enter first name',
      },
      last_name: {
        name: 'last_name',
        requiredErrorMsg: 'Please enter last name',
      },
      relationship: {
        name: 'relationship',
        requiredErrorMsg: 'Please select relationship',
      },
      birthday: {
        name: 'birthday',
        requiredErrorMsg: 'Please select date of birth',
      },
    },
    pets: {
      name: 'pets',
      pet_name: {
        name: 'name',
        requiredErrorMsg: 'Please enter pet name',
      },
      pet_type: {
        name: 'pet_type',
        requiredErrorMsg: 'Please select pet type',
      },
      weight: {
        name: 'weight',
        requiredErrorMsg: 'Please enter pet weight',
      },
      age: {
        name: 'age',
        requiredErrorMsg: 'Please enter pet age',
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
    is_defendant_in_any_lawsuit: {
      name: 'is_defendant_in_any_lawsuit',
      requiredErrorMsg: 'Please select unlawful act',
    },
    is_convicted: {
      name: 'is_convicted',
      requiredErrorMsg: 'Please select convicted',
    },
    have_filed_case_against_landlord: {
      name: 'have_filed_case_against_landlord',
      requiredErrorMsg: 'Please select case against landlord',
    },
    is_smoker: {
      name: 'is_smoker',
      requiredErrorMsg: 'Please select dependent smoker',
    },
    notes: {
      name: 'notes',
      requiredErrorMsg: 'Please enter notes',
    },
    files: {
      name: 'files',
      file: {
        name: 'file',
        requiredErrorMsg: 'Please select file',
      },
      file_type: {
        name: 'file_type',
        requiredErrorMsg: 'Please select file type',
      },
    },
  },
};

export default formFields;
