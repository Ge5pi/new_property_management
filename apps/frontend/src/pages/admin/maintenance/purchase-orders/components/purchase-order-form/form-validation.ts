import * as Yup from 'yup';

import formModal from './form-fields';

const {
  description,
  items,
  required_by_date,
  // discount_flat,
  // discount_percentage,
  tax,
  discount,
  notes,
  shipping_flat,
  shipping_percentage,
  // tax_flat,
  // tax_percentage,
  vendor,
} = formModal;

export default Yup.object().shape({
  [description.name]: Yup.string().trim().required(`${description.requiredErrorMsg}`),
  [required_by_date.name]: Yup.date().required(`${required_by_date.requiredErrorMsg}`),
  [vendor.name]: Yup.array()
    .of(Yup.object().required('a valid selected option required!'))
    .min(1, vendor.requiredErrorMsg),
  // [discount_percentage.name]: Yup.number().positive('Enter a valid number!'),
  // [discount_flat.name]: Yup.number().positive('Enter a valid number!'),
  [discount.name]: Yup.number().positive('Enter a valid number!'),

  // [tax_percentage.name]: Yup.number().positive('Enter a valid number!'),
  // [tax_flat.name]: Yup.number().positive('Enter a valid number!'),
  [tax.name]: Yup.number().positive('Enter a valid number!'),

  [shipping_percentage.name]: Yup.number().positive('Enter a valid number!'),
  [shipping_flat.name]: Yup.number().positive('Enter a valid number!'),
  [notes.name]: Yup.string().trim(),

  [items.name]: Yup.array()
    .of(
      Yup.object().shape({
        [items.inventory_item.name]: Yup.array()
          .of(Yup.object().required('a valid selected option required!'))
          .min(1, items.inventory_item.requiredErrorMsg),
        [items.quantity.name]: Yup.number()
          .positive('Enter a valid number!')
          .required(`${items.quantity.requiredErrorMsg}`),
      })
    )
    .min(1, 'Please enter at least 1 item for this order'),
});
