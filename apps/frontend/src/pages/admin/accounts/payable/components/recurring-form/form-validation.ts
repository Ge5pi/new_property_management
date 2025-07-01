import * as Yup from 'yup';

import formFields from './form-fields';

const {
  notes,
  payer,
  remarks,
  bill_day,
  due_date,
  end_date,
  memo_on_check,
  months,
  post_code,
  repeats,
  start_date,
  total_amount,
} = formFields;

export default Yup.object().shape({
  [notes.name]: Yup.string().required(`${notes.requiredErrorMsg}`),
  [payer.name]: Yup.string().required(`${payer.requiredErrorMsg}`),
  [remarks.name]: Yup.string().required(`${remarks.requiredErrorMsg}`),
  [bill_day.name]: Yup.string().required(`${bill_day.requiredErrorMsg}`),
  [due_date.name]: Yup.string().required(`${due_date.requiredErrorMsg}`),
  [end_date.name]: Yup.string().required(`${end_date.requiredErrorMsg}`),
  [memo_on_check.name]: Yup.string().required(`${memo_on_check.requiredErrorMsg}`),
  [months.name]: Yup.string().required(`${months.requiredErrorMsg}`),
  [post_code.name]: Yup.string().required(`${post_code.requiredErrorMsg}`),
  [repeats.name]: Yup.string().required(`${repeats.requiredErrorMsg}`),
  [start_date.name]: Yup.string().required(`${start_date.requiredErrorMsg}`),
  [total_amount.name]: Yup.string().required(`${total_amount.requiredErrorMsg}`),
});
