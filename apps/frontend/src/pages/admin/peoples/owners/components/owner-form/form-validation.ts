import { yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import formFields from './form-fields';

const {
  first_name,
  last_name,
  company_name,
  personal_contact_numbers,
  personal_emails,
  company_contact_numbers,
  company_emails,
  tax_payer_id,
  city,
  state,
  country,
  is_use_as_display_name,
  is_company_name_as_tax_payer,
  street_address,
  zip,
  tax_payer,
  bank_account_number,
  bank_name,
  bank_branch,
  bank_routing_number,
  bank_account_title,
} = formFields;

export default Yup.object().shape({
  [first_name.name]: Yup.string().trim().required(`${first_name.requiredErrorMsg}`),
  [last_name.name]: Yup.string().trim().required(`${last_name.requiredErrorMsg}`),
  [company_name.name]: Yup.string().trim(),
  [personal_contact_numbers.name]: Yup.array()
    .of(
      Yup.object().shape({
        [personal_contact_numbers.phone.name]: yupPhoneInput.required('this field is required!'),
      })
    )
    .min(1, 'at least 1 contact number is required!'),
  [personal_emails.name]: Yup.array()
    .of(
      Yup.object().shape({
        [personal_emails.email.name]: Yup.string()
          .trim()
          .email(`${personal_emails.email.requiredErrorMsg}`)
          .required('this field is required!'),
      })
    )
    .min(1, 'at least 1 email address is required!'),
  [company_contact_numbers.name]: Yup.array()
    .of(
      Yup.object().shape({
        [company_contact_numbers.phone.name]: yupPhoneInput.required('this field is required!'),
      })
    )
    .min(1, 'at least 1 company contact is required!'),
  [company_emails.name]: Yup.array()
    .of(
      Yup.object().shape({
        [company_emails.email.name]: Yup.string()
          .trim()
          .email(`${company_emails.email.requiredErrorMsg}`)
          .required('this field is required!'),
      })
    )
    .min(1, 'at least 1 company email is required!'),
  [tax_payer_id.name]: Yup.string().trim().required(`${tax_payer_id.requiredErrorMsg}`),

  [street_address.name]: Yup.string().trim(),
  [city.name]: Yup.string().trim(),
  [state.name]: Yup.string().trim(),
  [zip.name]: Yup.string().trim(),
  [country.name]: Yup.string().trim(),
  [is_use_as_display_name.name]: Yup.boolean(),
  [is_company_name_as_tax_payer.name]: Yup.boolean(),
  [tax_payer.name]: Yup.string()
    .trim()
    .when(is_company_name_as_tax_payer.name, {
      is: false,
      then: schema => schema.required(`${tax_payer.requiredErrorMsg}`),
    }),
  [bank_name.name]: Yup.string().trim(),
  [bank_branch.name]: Yup.string().trim(),
  [bank_routing_number.name]: Yup.string().trim(),
  [bank_account_number.name]: Yup.string().trim(),
  [bank_account_title.name]: Yup.string().trim(),
});
