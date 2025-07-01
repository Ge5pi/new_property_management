import * as Yup from 'yup';

import formFields from './form-fields';

const { reference_no, total_amount, date, from_account, property, to_account, unit, remarks } = formFields;

export default Yup.object().shape({
  [reference_no.name]: Yup.string().required(`${reference_no.requiredErrorMsg}`),
  [total_amount.name]: Yup.string().required(`${total_amount.requiredErrorMsg}`),
  [remarks.name]: Yup.string().required(`${remarks.requiredErrorMsg}`),
  [property.name]: Yup.string().required(`${property.requiredErrorMsg}`),
  [unit.name]: Yup.string().required(`${unit.requiredErrorMsg}`),
  [from_account.name]: Yup.string().required(`${from_account.requiredErrorMsg}`),
  [to_account.name]: Yup.string().required(`${to_account.requiredErrorMsg}`),
  [date.name]: Yup.string().required(`${date.requiredErrorMsg}`),
});
