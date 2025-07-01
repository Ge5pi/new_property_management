import * as Yup from 'yup';

import formFields from './form-fields';

const {
  notes,
  payer,
  reference_no,
  due_date,
  invoice_date,
  total_amount,
  purchase_order,
  work_order,
  project,
  gl_account,
  description,
} = formFields;

export default Yup.object().shape({
  [notes.name]: Yup.string().required(`${notes.requiredErrorMsg}`),
  [payer.name]: Yup.string().required(`${payer.requiredErrorMsg}`),
  [reference_no.name]: Yup.string().required(`${reference_no.requiredErrorMsg}`),
  [due_date.name]: Yup.string().required(`${due_date.requiredErrorMsg}`),
  [invoice_date.name]: Yup.string().required(`${invoice_date.requiredErrorMsg}`),
  [total_amount.name]: Yup.string().required(`${total_amount.requiredErrorMsg}`),
  [purchase_order.name]: Yup.string().required(`${purchase_order.requiredErrorMsg}`),
  [work_order.name]: Yup.string().required(`${work_order.requiredErrorMsg}`),
  [project.name]: Yup.string().required(`${project.requiredErrorMsg}`),
  [gl_account.name]: Yup.string().required(`${gl_account.requiredErrorMsg}`),
  [description.name]: Yup.string().required(`${description.requiredErrorMsg}`),
});
