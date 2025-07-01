import * as Yup from 'yup';

import formFields from './form-fields';

const { subject, body, signature, existing_signature, files } = formFields;

export default Yup.object().shape({
  [subject.name]: Yup.string().trim().required(`${subject.requiredErrorMsg}`),
  [signature.name]: Yup.string().trim(),
  [existing_signature.name]: Yup.number().positive().nullable(),
  [body.name]: Yup.string().trim().required(`${body.requiredErrorMsg}`),
  [files.name]: Yup.array().of(
    Yup.mixed().test('is-valid-size', 'Max allowed size is 20MBs', value =>
      Boolean(value && value instanceof File && value.size <= 2e7)
    )
  ),
});
