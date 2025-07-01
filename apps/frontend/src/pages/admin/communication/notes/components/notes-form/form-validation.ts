import { yupFilterInput } from 'validations/base';
import * as Yup from 'yup';

import formFields from './form-fields';

const { title, description, associated_to, files, tags } = formFields;

export default Yup.object().shape({
  [title.name]: Yup.string().required(`${title.requiredErrorMsg}`),
  [description.name]: Yup.string().required(`${description.requiredErrorMsg}`),
  [associated_to.name]: yupFilterInput.required(`${associated_to.requiredErrorMsg}`),
  [files.name]: Yup.array().of(Yup.mixed()),
  [tags.name]: Yup.array().of(Yup.object()),
});
