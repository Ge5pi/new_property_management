import * as Yup from 'yup';

import formFields from './form-fields';

const {
  subject,
  individual_recipient_type,
  recipient_type,
  body,
  signature,
  existing_signature,
  vendors,
  owners,
  units,
  tenants,
} = formFields;

export default Yup.object().shape({
  [subject.name]: Yup.string().trim().required(`${subject.requiredErrorMsg}`),
  [recipient_type.name]: Yup.string()
    .trim()
    .required('This field is required!')
    .oneOf(['INDIVIDUAL', 'PROPERTY'], 'Invalid option provided'),
  [individual_recipient_type.name]: Yup.string()
    .trim()
    .when(recipient_type.name, {
      is: 'INDIVIDUAL',
      then: schema =>
        schema.oneOf(['TENANT', 'OWNER', 'VENDOR'], 'Invalid option provided').required('This field is required!'),
    }),
  [body.name]: Yup.string().trim().required(`${body.requiredErrorMsg}`),
  [signature.name]: Yup.string().trim(),
  [existing_signature.name]: Yup.number().positive().nullable(),
  [tenants.name]: Yup.array().when(individual_recipient_type.name, {
    is: 'TENANT',
    then: schema => schema.of(Yup.object().required('a valid selected option required!')),
  }),
  [vendors.name]: Yup.array().when(individual_recipient_type.name, {
    is: 'VENDOR',
    then: schema => schema.of(Yup.object().required('a valid selected option required!')),
  }),
  [owners.name]: Yup.array().when(individual_recipient_type.name, {
    is: 'OWNER',
    then: schema => schema.of(Yup.object().required('a valid selected option required!')),
  }),
  [units.name]: Yup.array().when(recipient_type.name, {
    is: 'PROPERTY',
    then: schema => schema.of(Yup.object().required('a valid selected option required!')),
  }),
});
