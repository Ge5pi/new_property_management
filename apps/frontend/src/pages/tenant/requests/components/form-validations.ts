import * as Yup from 'yup';

const base = Yup.object().shape({
  request_type: Yup.string().oneOf(['GENERAL', 'MAINTENANCE']).required('Required'),
  subject: Yup.string().required('Subject is Required'),
  description: Yup.string().required('Description is Required'),
});

export const RequestSchema = {
  GENERAL: base,
  MAINTENANCE: base.shape({
    category: Yup.string().required('Category is Required'),
    is_permission: Yup.boolean().required('Permission is Required'),
    is_pets: Yup.boolean().required('Pets is Required'),
  }),
};
