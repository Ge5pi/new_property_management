const formFields = {
  formId: 'leaseTemplateForm',
  formField: {
    lease_duration_from_date: {
      name: 'lease_duration_from_date',
      requiredErrorMsg: 'Please select a starting duration date',
    },
    lease_duration_to_date: {
      name: 'lease_duration_to_date',
      requiredErrorMsg: 'Please select a ending duration date',
    },
    decided_rent_amount: {
      name: 'decided_rent_amount',
      requiredErrorMsg: 'Please enter a rent amount',
    },
    decided_charges_amount: {
      name: 'decided_charges_amount',
      requiredErrorMsg: 'Please enter charges amount',
    },
    deposit_amount: {
      name: 'deposit_amount',
      requiredErrorMsg: 'Please enter deposit amount',
    },
    due_date: {
      name: 'due_date',
      requiredErrorMsg: 'Please select a due date for deposit',
    },
    rules_and_policies: {
      name: 'rules_and_policies',
      rule: {
        name: 'rule',
        requiredErrorMsg: 'Please add at least 1 rule/policy',
      },
    },
    condition_of_premises: {
      name: 'condition_of_premises',
      condition: {
        name: 'condition',
        requiredErrorMsg: 'Please enter a condition of premises & alternations',
      },
    },
    conditions_of_moving_out: {
      name: 'conditions_of_moving_out',
      condition: {
        name: 'condition',
        requiredErrorMsg: 'Please enter a condition of moving out',
      },
    },
    right_of_inspection: {
      name: 'right_of_inspection',
      requiredErrorMsg: 'Please select one of the options given',
    },
    releasing_policies: {
      name: 'releasing_policies',
      policy: {
        name: 'policy',
        requiredErrorMsg: 'Please add at least 1 policy for releasing',
      },
    },
    final_statement: {
      name: 'final_statement',
      requiredErrorMsg: 'this field is required!',
    },
    owner_signature: {
      name: 'owner_signature',
      requiredErrorMsg: 'this field is required!',
    },
    tenant_signature: {
      name: 'tenant_signature',
      requiredErrorMsg: 'this field is required!',
    },
  },
};

export default formFields;
