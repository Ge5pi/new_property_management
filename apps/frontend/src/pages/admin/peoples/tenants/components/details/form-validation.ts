import { yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import FormFields from './form-fields';

const {
  formField: { phone_number, emails, financial_information, emergency_contacts },
} = FormFields;

const formValidations = {
  contact_details: Yup.object().shape({
    [phone_number.name]: Yup.array().of(
      Yup.object().shape({
        [phone_number.phone.name]: yupPhoneInput.required(`${phone_number.phone.requiredErrorMsg}`),
      })
    ),
    [emails.name]: Yup.array().of(
      Yup.object().shape({
        [emails.email.name]: Yup.string()
          .trim()
          .email(`${emails.email.requiredErrorMsg}`)
          .required(`${emails.email.requiredErrorMsg}`),
      })
    ),
  }),
  financial_information: Yup.object().shape({
    [financial_information.name]: Yup.array().of(
      Yup.object().shape({
        [financial_information.bank.name]: Yup.string()
          .trim()
          .required(`${financial_information.bank.requiredErrorMsg}`),
        [financial_information.account_name.name]: Yup.string()
          .trim()
          .required(`${financial_information.account_name.requiredErrorMsg}`),
        [financial_information.account_number.name]: Yup.string()
          .trim()
          .required(`${financial_information.account_number.requiredErrorMsg}`),
        [financial_information.account_type.name]: Yup.string()
          .trim()
          .required(`${financial_information.account_type.requiredErrorMsg}`),
      })
    ),
  }),
  emergency_contacts: Yup.object().shape({
    [emergency_contacts.name]: Yup.array().of(
      Yup.object().shape({
        [emergency_contacts.emergency_contact_name.name]: Yup.string()
          .trim()
          .required(`${emergency_contacts.emergency_contact_name.requiredErrorMsg}`),
        [emergency_contacts.emergency_contact_phone_number.name]: yupPhoneInput.required(
          `${emergency_contacts.emergency_contact_phone_number.requiredErrorMsg}`
        ),
        [emergency_contacts.emergency_contact_relationship.name]: Yup.string()
          .trim()
          .required(`${emergency_contacts.emergency_contact_relationship.requiredErrorMsg}`),
        [emergency_contacts.emergency_contact_address.name]: Yup.string()
          .trim()
          .required(`${emergency_contacts.emergency_contact_address.requiredErrorMsg}`),
      })
    ),
  }),
};

export default formValidations;
