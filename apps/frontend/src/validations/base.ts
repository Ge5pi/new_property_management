import * as Yup from 'yup';

import { validatePhone } from 'utils/functions';

export const yupFilterInput = Yup.array()
  .length(1, 'This field is required!')
  .of(Yup.object().required('a valid selected option required!'));

export const yupPhoneInput = Yup.string()
  .trim()
  .transform((v, o) => (o === '' ? null : v))
  .test('phone_number', 'enter a valid phone number starting with country code.', (value, context) => {
    let isRequired = false;
    const schema = context.schema;
    if ('exclusiveTests' in schema && 'required' in schema.exclusiveTests) {
      if (schema.exclusiveTests.required) {
        isRequired = true;
      }
    }
    return (isRequired && value) || (value && value.length > 0) ? validatePhone(value) : true;
  });

export const authValidationSchema = Yup.object().shape({
  email: Yup.string().email().required('this field is required!'),
  password: Yup.string().required('this field is required!'),
});
