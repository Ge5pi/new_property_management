import * as Yup from 'yup';

import formFields from './form-fields';

const { notes, reference_no, total_amount, gl_account, bill_date, memo_on_check, property, remarks, owner } =
  formFields;

export default Yup.object().shape({
  [notes.name]: Yup.string().required(`${notes.requiredErrorMsg}`),
  [reference_no.name]: Yup.string().required(`${reference_no.requiredErrorMsg}`),
  [total_amount.name]: Yup.string().required(`${total_amount.requiredErrorMsg}`),
  [gl_account.name]: Yup.string().required(`${gl_account.requiredErrorMsg}`),
  [bill_date.name]: Yup.string().required(`${bill_date.requiredErrorMsg}`),
  [memo_on_check.name]: Yup.string().required(`${memo_on_check.requiredErrorMsg}`),
  [property.name]: Yup.string().required(`${property.requiredErrorMsg}`),
  [remarks.name]: Yup.string().required(`${remarks.requiredErrorMsg}`),
  [owner.name]: Yup.string().required(`${owner.requiredErrorMsg}`),
});
