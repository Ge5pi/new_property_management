import * as Yup from 'yup';

import formFields from './form-fields';

const {
  notes,
  payer,
  reference_no,
  due_date,
  total_amount,
  gl_account,
  property,
  utility,
  bill_date,
  memo_on_check,
  remarks,
  from,
  to,
} = formFields;

export default Yup.object().shape({
  [notes.name]: Yup.string().required(`${notes.requiredErrorMsg}`),
  [payer.name]: Yup.string().required(`${payer.requiredErrorMsg}`),
  [reference_no.name]: Yup.string().required(`${reference_no.requiredErrorMsg}`),
  [due_date.name]: Yup.string().required(`${due_date.requiredErrorMsg}`),
  [total_amount.name]: Yup.string().required(`${total_amount.requiredErrorMsg}`),
  [gl_account.name]: Yup.string().required(`${gl_account.requiredErrorMsg}`),
  [property.name]: Yup.string().required(`${property.requiredErrorMsg}`),
  [utility.name]: Yup.string().required(`${utility.requiredErrorMsg}`),
  [bill_date.name]: Yup.string().required(`${bill_date.requiredErrorMsg}`),
  [memo_on_check.name]: Yup.string().required(`${memo_on_check.requiredErrorMsg}`),
  [remarks.name]: Yup.string().required(`${remarks.requiredErrorMsg}`),
  [from.name]: Yup.string().required(`${from.requiredErrorMsg}`),
  [to.name]: Yup.string().required(`${to.requiredErrorMsg}`),
});
