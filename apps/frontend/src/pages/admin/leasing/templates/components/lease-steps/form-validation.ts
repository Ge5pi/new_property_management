import * as Yup from 'yup';

import { FormFields } from 'pages/admin/leasing/components/lease-steps';

const {
  formField: {
    conditions_of_moving_out,
    right_of_inspection,
    condition_of_premises,
    releasing_policies,
    rules_and_policies,
    final_statement,
  },
} = FormFields;

const formValidations = {
  residency_and_financial: undefined,
  policies_and_procedures: Yup.object().shape({
    [rules_and_policies.name]: Yup.array()
      .of(
        Yup.object().shape({
          [rules_and_policies.rule.name]: Yup.string()
            .trim()
            .required(`${rules_and_policies.rule.requiredErrorMsg}`)
            .max(300, 'maximum characters allowed 300'),
        })
      )
      .min(1, 'Please enter at least 1 policy')
      .required('this field is required!'),
  }),
  responsibilities: Yup.object().shape({
    [condition_of_premises.name]: Yup.array()
      .of(
        Yup.object().shape({
          [condition_of_premises.condition.name]: Yup.string()
            .trim()
            .required(`${condition_of_premises.condition.requiredErrorMsg}`)
            .max(300, 'maximum characters allowed 300'),
        })
      )
      .min(1, 'Please enter at least 1 condition'),
    [conditions_of_moving_out.name]: Yup.array()
      .of(
        Yup.object().shape({
          [conditions_of_moving_out.condition.name]: Yup.string()
            .trim()
            .required(`${conditions_of_moving_out.condition.requiredErrorMsg}`)
            .max(300, 'maximum characters allowed 300'),
        })
      )
      .min(1, 'Please provide at least 1 condition'),
    [right_of_inspection.name]: Yup.boolean()
      .oneOf([true, false], 'Selected value must be one of "true" or "false"')
      .default(false),
  }),
  general: Yup.object().shape({
    [releasing_policies.name]: Yup.array()
      .of(
        Yup.object().shape({
          [releasing_policies.policy.name]: Yup.string()
            .trim()
            .required(`${releasing_policies.policy.requiredErrorMsg}`)
            .max(300, 'maximum characters allowed 300'),
        })
      )
      .min(1, 'Please enter at least 1 policy'),
  }),
  sign_and_accept: Yup.object().shape({
    [final_statement.name]: Yup.string().trim().required('this field is required!'),
  }),
};

export default formValidations;
