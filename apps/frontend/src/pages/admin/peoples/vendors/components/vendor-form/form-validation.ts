import { yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import formFields from './form-fields';

const {
  first_name,
  last_name,
  company_name,
  vendor_type,
  gl_account,
  personal_contact_numbers,
  business_contact_numbers,
  personal_emails,
  business_emails,
  website,
  addresses,
  insurance_expiry_date,
  insurance_policy_number,
  insurance_provide_name,
  tax_identity_type,
  tax_payer_id,
} = formFields;

export default Yup.object().shape({
  [first_name.name]: Yup.string().trim().required(`${first_name.requiredErrorMsg}`),
  [last_name.name]: Yup.string().trim().required(`${last_name.requiredErrorMsg}`),
  [company_name.name]: Yup.string().trim().required(`${company_name.requiredErrorMsg}`),
  [vendor_type.name]: Yup.array()
    .of(Yup.object().required(vendor_type.requiredErrorMsg))
    .min(1, vendor_type.requiredErrorMsg)
    .max(1, vendor_type.requiredErrorMsg)
    .required(vendor_type.requiredErrorMsg),
  [gl_account.name]: Yup.string().trim().required(`${gl_account.requiredErrorMsg}`),
  [personal_contact_numbers.name]: Yup.array()
    .of(
      Yup.object().shape({
        [personal_contact_numbers.phone.name]: yupPhoneInput.required('this field is required!'),
      })
    )
    .min(1, 'please enter at least 1 contact number'),
  [business_contact_numbers.name]: Yup.array()
    .of(
      Yup.object().shape({
        [business_contact_numbers.phone.name]: yupPhoneInput.required('this field is required!'),
      })
    )
    .min(1, 'please enter at least 1 business number'),
  [personal_emails.name]: Yup.array()
    .of(
      Yup.object().shape({
        [personal_emails.email.name]: Yup.string()
          .email(`${personal_emails.email.requiredErrorMsg}`)
          .required('this field is required!'),
      })
    )
    .min(1, 'please enter at least 1 email address'),
  [business_emails.name]: Yup.array()
    .of(
      Yup.object().shape({
        [business_emails.email.name]: Yup.string()
          .email(`${business_emails.email.requiredErrorMsg}`)
          .required('this field is required!'),
      })
    )
    .min(1, 'please enter at least 1 business email'),
  [website.name]: Yup.string().url().required('this field is required!'),
  [addresses.name]: Yup.array().of(
    Yup.object().shape({
      [addresses.street_address.name]: Yup.string().trim().required(`${addresses.street_address.requiredErrorMsg}`),
      [addresses.city.name]: Yup.string().trim().required(`${addresses.city.requiredErrorMsg}`),
      [addresses.state.name]: Yup.string().trim().required(`${addresses.state.requiredErrorMsg}`),
      [addresses.zip.name]: Yup.string().trim().required(`${addresses.zip.requiredErrorMsg}`),
      [addresses.country.name]: Yup.string().trim().required(`${addresses.country.requiredErrorMsg}`),
    })
  ),
  [insurance_expiry_date.name]: Yup.date().required(`${insurance_expiry_date.requiredErrorMsg}`),
  [insurance_policy_number.name]: Yup.string().trim().required(`${insurance_policy_number.requiredErrorMsg}`),
  [insurance_provide_name.name]: Yup.string().trim().required(`${insurance_provide_name.requiredErrorMsg}`),
  [tax_identity_type.name]: Yup.string().trim().required(`${tax_identity_type.requiredErrorMsg}`),
  [tax_payer_id.name]: Yup.string().trim().required(`${tax_payer_id.requiredErrorMsg}`),
});
