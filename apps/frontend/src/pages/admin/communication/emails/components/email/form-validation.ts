import * as Yup from 'yup';

import formFields from './form-fields';

const {
  subject,
  individual_recipient_type,
  recipient_type,
  body,
  signature,
  existing_signature,
  template,
  vendors,
  owners,
  units,
  tenants,
  files,
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
  [signature.name]: Yup.string().trim(),
  [existing_signature.name]: Yup.number().positive().nullable(),
  [body.name]: Yup.string().trim().required(`${body.requiredErrorMsg}`),
  [tenants.name]: Yup.array().when(individual_recipient_type.name, {
    is: 'TENANT',
    then: schema =>
      schema.of(Yup.object().required('a valid selected option required!')).min(1, tenants.requiredErrorMsg),
  }),
  [vendors.name]: Yup.array().when(individual_recipient_type.name, {
    is: 'VENDOR',
    then: schema =>
      schema.of(Yup.object().required('a valid selected option required!')).min(1, vendors.requiredErrorMsg),
  }),
  [owners.name]: Yup.array().when(individual_recipient_type.name, {
    is: 'OWNER',
    then: schema =>
      schema.of(Yup.object().required('a valid selected option required!')).min(1, owners.requiredErrorMsg),
  }),
  [units.name]: Yup.array().when(recipient_type.name, {
    is: 'PROPERTY',
    then: schema =>
      schema.of(Yup.object().required('a valid selected option required!')).min(1, units.requiredErrorMsg),
  }),
  [template.name]: Yup.array().of(Yup.object().required('a valid selected option required!')),
  [files.name]: Yup.array().of(
    Yup.mixed().test('is-valid-size', 'Max allowed size is 20MBs', value =>
      Boolean(value && value instanceof File && value.size <= 2e7)
    )
  ),
});
