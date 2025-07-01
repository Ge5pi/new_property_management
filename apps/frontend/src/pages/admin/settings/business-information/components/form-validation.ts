import { yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import formModal from './form-fields';

const {
  building_or_office_number,
  description,
  name,
  city,
  country,
  postal_code,
  primary_email,
  secondary_email,
  state,
  street,
  phone_number,
  telephone_number,
  tax_identity_type,
  tax_payer_id,
  logo,
} = formModal;

export default Yup.object().shape({
  image_preview: Yup.boolean().default(false),
  [logo.name]: Yup.mixed()
    .when('image_preview', {
      is: false,
      then: schema => schema.required(logo.requiredErrorMsg),
    })
    .nullable(),
  [name.name]: Yup.string().trim().required(name.requiredErrorMsg),
  [description.name]: Yup.string().trim().required(description.requiredErrorMsg).min(5),
  [building_or_office_number.name]: Yup.string().trim().required(building_or_office_number.requiredErrorMsg),
  [street.name]: Yup.string().trim().required(street.requiredErrorMsg),
  [city.name]: Yup.string().trim().required(city.requiredErrorMsg),
  [postal_code.name]: Yup.string().trim().required(postal_code.requiredErrorMsg),
  [state.name]: Yup.string().trim().required(state.requiredErrorMsg),
  [country.name]: Yup.string().trim().required(country.requiredErrorMsg),
  [primary_email.name]: Yup.string().trim().required(primary_email.requiredErrorMsg),
  [secondary_email.name]: Yup.string().trim().email(),
  [phone_number.name]: yupPhoneInput.required(phone_number.requiredErrorMsg),
  [telephone_number.name]: yupPhoneInput,
  [tax_identity_type.name]: Yup.string().required(tax_identity_type.requiredErrorMsg),
  [tax_payer_id.name]: Yup.string().required(tax_payer_id.requiredErrorMsg),
});
