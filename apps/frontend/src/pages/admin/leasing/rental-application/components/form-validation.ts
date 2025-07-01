import { yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import { FormFields } from 'pages/admin/leasing/components/application-steps';

const {
  formField: {
    desired_move_in_date,
    legal_first_name,
    middle_name,
    legal_last_name,
    application_type,
    birthday,
    ssn_or_tin,
    driving_license_number,
    phone_number,
    emails,
    residential_history,
    financial_information,
    employer_name,
    employer_address,
    employer_phone_number,
    employment_city,
    employment_country,
    employment_zip_code,
    position_held,
    monthly_salary,
    supervisor_email,
    supervisor_name,
    supervisor_phone_number,
    supervisor_title,
    years_worked,
    additional_income,
    dependents,
    pets,
    emergency_contacts,
    have_filed_case_against_landlord,
    is_defendant_in_any_lawsuit,
    is_convicted,
    notes,
  },
} = FormFields;

const formValidations = {
  general_info: Yup.object().shape({
    [desired_move_in_date.name]: Yup.date(),
    [legal_first_name.name]: Yup.string().trim(),
    [middle_name.name]: Yup.string().trim(),
    [legal_last_name.name]: Yup.string().trim(),
    [application_type.name]: Yup.string().trim(),
  }),
  personal_details: Yup.object().shape({
    [birthday.name]: Yup.date().test('birthday', 'Birthday must be smaller than today', value => {
      const curr = new Date();
      curr.setHours(0, 0, 0, 0);
      return value ? new Date(value) < curr : true;
    }),
    [ssn_or_tin.name]: Yup.string().trim(),
    [driving_license_number.name]: Yup.string().trim(),
    [phone_number.name]: Yup.array().of(
      Yup.object().shape({
        [phone_number.phone.name]: yupPhoneInput,
      })
    ),
    [emails.name]: Yup.array()
      .of(
        Yup.object().shape({
          [emails.email.name]: Yup.string()
            .trim()
            .email(`${emails.email.requiredErrorMsg}`)
            .required(`${emails.email.requiredErrorMsg}`),
        })
      )
      .min(1, 'minimum 1 email is required!'),
  }),
  rental_history: Yup.object().shape({
    [residential_history.name]: Yup.array().of(
      Yup.object().shape({
        [residential_history.current_address.name]: Yup.string()
          .trim()
          .required(`${residential_history.current_address.requiredErrorMsg}`),
        [residential_history.current_address_2.name]: Yup.string().trim(),
        [residential_history.current_city.name]: Yup.string().trim(),
        [residential_history.current_state.name]: Yup.string().trim(),
        [residential_history.current_zip_code.name]: Yup.string().trim(),
        [residential_history.current_country.name]: Yup.string()
          .trim()
          .required(`${residential_history.current_country.requiredErrorMsg}`),
        [residential_history.resident_from.name]: Yup.date(),
        [residential_history.resident_to.name]: Yup.date(),
        [residential_history.monthly_rent.name]: Yup.string().trim(),
        [residential_history.landlord_name.name]: Yup.string().trim(),
        [residential_history.landlord_phone_number.name]: yupPhoneInput,
        [residential_history.landlord_email.name]: Yup.string()
          .trim()
          .email(`${residential_history.landlord_email.requiredErrorMsg}`),
        [residential_history.reason_of_leaving.name]: Yup.string().trim(),
      })
    ),
  }),
  financial_info: Yup.object().shape({
    [financial_information.name]: Yup.array().of(
      Yup.object().shape({
        [financial_information.bank.name]: Yup.string()
          .trim()
          .required(`${financial_information.bank.requiredErrorMsg}`),
        [financial_information.account_name.name]: Yup.string()
          .trim()
          .required(`${financial_information.account_name.requiredErrorMsg}`),
        [financial_information.account_number.name]: Yup.string()
          .trim()
          .required(`${financial_information.account_number.requiredErrorMsg}`),
        [financial_information.account_type.name]: Yup.string()
          .trim()
          .required(`${financial_information.account_type.requiredErrorMsg}`),
      })
    ),
    [employer_name.name]: Yup.string().trim(),
    [employer_address.name]: Yup.string().trim(),
    [employment_city.name]: Yup.string().trim(),
    [employment_country.name]: Yup.string().trim(),
    [employment_zip_code.name]: Yup.string().trim(),
    [employer_phone_number.name]: yupPhoneInput,
    [position_held.name]: Yup.string().trim(),
    [monthly_salary.name]: Yup.string().trim(),
    [supervisor_email.name]: Yup.string().trim().email(`${supervisor_email.requiredErrorMsg}`),
    [supervisor_name.name]: Yup.string().trim(),
    [supervisor_phone_number.name]: yupPhoneInput,
    [supervisor_title.name]: Yup.string().trim(),
    [years_worked.name]: Yup.string().trim(),
    [additional_income.name]: Yup.array().of(
      Yup.object().shape({
        [additional_income.monthly_income.name]: Yup.number().required(
          `${additional_income.monthly_income.requiredErrorMsg}`
        ),
        [additional_income.source_of_income.name]: Yup.string()
          .trim()
          .required(`${additional_income.source_of_income.requiredErrorMsg}`),
      })
    ),
  }),
  dependents_info: Yup.object().shape({
    [dependents.name]: Yup.array().of(
      Yup.object().shape({
        [dependents.first_name.name]: Yup.string().trim().required(`${dependents.first_name.requiredErrorMsg}`),
        [dependents.last_name.name]: Yup.string().trim().required(`${dependents.last_name.requiredErrorMsg}`),
        [dependents.relationship.name]: Yup.string().trim().required(`${dependents.relationship.requiredErrorMsg}`),
        [dependents.birthday.name]: Yup.date()
          .test('birthday', 'Birthday must be smaller than today', value => {
            const curr = new Date();
            curr.setHours(0, 0, 0, 0);
            return value ? new Date(value) < curr : true;
          })
          .required(`${dependents.birthday.requiredErrorMsg}`),
      })
    ),
    [pets.name]: Yup.array().of(
      Yup.object().shape({
        [pets.pet_name.name]: Yup.string().trim().required(`${pets.pet_name.requiredErrorMsg}`),
        [pets.pet_type.name]: Yup.string().trim().required(`${pets.pet_type.requiredErrorMsg}`),
        [pets.weight.name]: Yup.string().trim(),
        [pets.age.name]: Yup.number().positive('must be a positive number!'),
      })
    ),
  }),
  other_info: Yup.object().shape({
    [emergency_contacts.name]: Yup.array().of(
      Yup.object().shape({
        [emergency_contacts.emergency_contact_name.name]: Yup.string().trim().required('this field is required!'),
        [emergency_contacts.emergency_contact_phone_number.name]: yupPhoneInput.required('this field is required!'),
        [emergency_contacts.emergency_contact_relationship.name]: Yup.string()
          .trim()
          .required('this field is required!'),
        [emergency_contacts.emergency_contact_address.name]: Yup.string().trim().required('this field is required!'),
      })
    ),
    [is_defendant_in_any_lawsuit.name]: Yup.boolean()
      .oneOf([true, false], 'Selected value must be one of "true" or "false"')
      .default(false),
    [is_convicted.name]: Yup.boolean()
      .oneOf([true, false], 'Selected value must be one of "true" or "false"')
      .default(false),
    [have_filed_case_against_landlord.name]: Yup.boolean()
      .oneOf([true, false], 'Selected value must be one of "true" or "false"')
      .default(false),
    [have_filed_case_against_landlord.name]: Yup.boolean()
      .oneOf([true, false], 'Selected value must be one of "true" or "false"')
      .default(false),
    [notes.name]: Yup.string().trim(),
  }),
};

export default formValidations;
