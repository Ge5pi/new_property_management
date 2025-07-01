import * as Yup from 'yup';

import formFields from './form-fields';

const { name, bank } = formFields;

export default Yup.object().shape({
  [name.name]: Yup.string().required(`${name.requiredErrorMsg}`),
  [bank.name]: Yup.string().required(`${bank.requiredErrorMsg}`),
});
