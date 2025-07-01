import { yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import formFields from './form-fields';

const {
  first_name,
  last_name,
  username,
  company_name,
  mobile_number,
  primary_email,
  other_info,
  secondary_email,
  telephone_number,
  role,
  is_tenant,
  is_superuser,
} = formFields;

export default Yup.object().shape({
  [first_name.name]: Yup.string().trim().required(`${first_name.requiredErrorMsg}`),
  [last_name.name]: Yup.string().trim().required(`${last_name.requiredErrorMsg}`),
  [username.name]: Yup.string().trim().required(`${last_name.requiredErrorMsg}`),
  [company_name.name]: Yup.string().trim(),
  [telephone_number.name]: yupPhoneInput,
  [mobile_number.name]: yupPhoneInput.required(`${mobile_number.requiredErrorMsg}`),
  [primary_email.name]: Yup.string().trim().email().required(`${primary_email.requiredErrorMsg}`),
  [secondary_email.name]: Yup.string().trim().email(),
  [other_info.name]: Yup.string().trim(),
  [is_superuser.name]: Yup.boolean(),
  [is_tenant.name]: Yup.boolean(),
  [role.name]: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .test('test-if-tenant-admin', 'Please select at least 1 role', (value, context) => {
      const tenant = context.parent[is_tenant.name];
      const admin = context.parent[is_superuser.name];

      if (value && value.length > 0) return true;
      if (admin || tenant) return true;
      return false;
    }),
});
