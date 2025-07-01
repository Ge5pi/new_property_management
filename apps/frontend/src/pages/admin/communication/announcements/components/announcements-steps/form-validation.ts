import * as Yup from 'yup';

import formFields from './form-fields';

const {
  body,
  display_date,
  display_on_portal,
  is_selective_properties,
  is_selective_units,
  properties,
  units,
  expiry_date,
  is_all_properties,
  is_all_units,
  is_send_email,
  selection,
  title,
} = formFields;

const formValidations = [
  Yup.object().shape(
    {
      [title.name]: Yup.string().trim().required(`${title.requiredErrorMsg}`),

      [is_all_properties.name]: Yup.boolean().when(is_selective_properties.name, {
        is: false,
        then: schema => schema.oneOf([true], 'please select one of the following field'),
      }),
      [is_selective_properties.name]: Yup.boolean().when(is_all_properties.name, {
        is: false,
        then: schema => schema.oneOf([true], 'please select one of the following field'),
      }),

      [is_all_units.name]: Yup.boolean().when(is_selective_units.name, {
        is: false,
        then: schema => schema.oneOf([true], 'please select one of the following field'),
      }),
      [is_selective_units.name]: Yup.boolean().when(is_all_units.name, {
        is: false,
        then: schema => schema.oneOf([true], 'please select one of the following field'),
      }),

      [body.name]: Yup.string().trim().required(`${body.requiredErrorMsg}`),
      [is_send_email.name]: Yup.boolean(),
      [display_on_portal.name]: Yup.boolean(),
      [display_date.name]: Yup.date().required(`${display_date.requiredErrorMsg}`),
      [expiry_date.name]: Yup.date()
        .when(display_date.name, (start_time: Date[], schema) => {
          const date = start_time && start_time.length > 0 && start_time[0];
          if (date) {
            const currentDay = new Date(date.getTime());
            return schema.min(currentDay, 'Expiry date must be after display date');
          } else {
            return schema;
          }
        })
        .required(`${expiry_date.requiredErrorMsg}`),
      [selection.name]: Yup.string()
        .trim()
        .oneOf(['APSU', 'APAU', 'SPAU', 'SPSU'], 'please select one of the following field'),
      [units.name]: Yup.array().when(is_selective_units.name, {
        is: true,
        then: schema =>
          schema.of(Yup.object().required('a valid selected option required!')).min(1, units.requiredErrorMsg),
      }),
      [properties.name]: Yup.array().when(is_selective_properties.name, {
        is: true,
        then: schema =>
          schema.of(Yup.object().required('a valid selected option required!')).min(1, properties.requiredErrorMsg),
      }),
    },
    [
      [is_selective_properties.name, is_all_properties.name],
      [is_all_units.name, is_selective_units.name],
    ]
  ),
];

export default formValidations;
