import * as Yup from 'yup';

import formFields from './form-fields';

const { name, groups, description } = formFields;

export default Yup.object().shape({
  [name.name]: Yup.string().trim().required(name.requiredErrorMsg),
  [description.name]: Yup.string().trim().min(3),
  [groups.name]: Yup.array().of(Yup.number()).min(1, 'please select at least 1 group'),
});
