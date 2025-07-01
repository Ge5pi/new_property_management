import { yupFilterInput, yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import formFields from './form-fields';

const {
  contact_name,
  is_display_to_tenant,
  is_selective,
  address,
  category,
  email,
  primary_contact,
  secondary_contact,
  website,
} = formFields;

export default Yup.object().shape(
  {
    [contact_name.name]: Yup.string().trim().required(`${contact_name.requiredErrorMsg}`),
    [category.name]: yupFilterInput.required(category.requiredErrorMsg),
    [primary_contact.name]: yupPhoneInput.required(`${primary_contact.requiredErrorMsg}`),
    [secondary_contact.name]: yupPhoneInput,
    [email.name]: Yup.string().trim().email(),
    [website.name]: Yup.string().trim().url(),
    [address.name]: Yup.string().trim().required(`${address.requiredErrorMsg}`).min(5),
    [is_display_to_tenant.name]: Yup.boolean().when([is_selective.name], {
      is: false,
      then: schema => schema.oneOf([true], 'please select one of the following field'),
    }),
    [is_selective.name]: Yup.boolean().when([is_display_to_tenant.name], {
      is: false,
      then: schema => schema.oneOf([true], 'please select one of the following field'),
    }),
  },
  [[is_display_to_tenant.name, is_selective.name]]
);
