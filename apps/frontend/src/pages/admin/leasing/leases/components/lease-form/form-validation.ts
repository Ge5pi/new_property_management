import { yupFilterInput, yupPhoneInput } from 'validations/base';
import * as Yup from 'yup';

import { SearchObject } from 'interfaces/IGeneral';

import formModal, { leaseChargesFormFields, leaseDepositFormFields } from './form-fields';

const {
  property,
  lease_type,
  unit,
  description,
  due_date,
  gl_account,
  end_date,
  start_date,
  applicant,
  secondary_tenants,
  amount,
  rent_cycle,
  lease_disabled,
} = formModal;
const { charge_title, charge_account, charge_amount, charge_description, charge_type } = leaseChargesFormFields;

const { security_deposit_amount } = leaseDepositFormFields;

export default Yup.object().shape({
  [lease_disabled.name]: Yup.boolean(),
  [description.name]: Yup.string().trim(),
  [property.name]: yupFilterInput
    .required(`${property.requiredErrorMsg}`)
    .test('LateFeePolicy', 'Late Fee is not configured and/or property is not vacant', (value, ctx) => {
      if (ctx.parent[lease_disabled.name] === true) return true;
      const opt = value.filter(
        f => (f as SearchObject).is_late_fee_policy_configured && (f as SearchObject).is_occupied === false
      );
      if (opt.length > 0) return true;
      return false;
    }),
  [applicant.name]: yupFilterInput.required(`${applicant.requiredErrorMsg}`),
  [unit.name]: yupFilterInput
    .required(unit.requiredErrorMsg)
    .test('LateFeePolicy', 'Unit is not vacant', (value, ctx) => {
      if (ctx.parent[lease_disabled.name] === true) return true;
      const opt = value.filter(f => (f as SearchObject).is_occupied === false);
      if (opt.length > 0) return true;
      return false;
    }),
  [lease_type.name]: Yup.string().trim().oneOf(['FIXED', 'AT_WILL']).required(`${lease_type.requiredErrorMsg}`),
  [start_date.name]: Yup.date().required(`${start_date.requiredErrorMsg}`),
  [end_date.name]: Yup.date()
    .when(start_date.name, (start_time: Date[], schema) => {
      const date = start_time && start_time.length > 0 && start_time[0];
      if (date) {
        const currentDay = new Date(date.getTime());
        return schema.min(currentDay, 'End date must be after start date');
      } else {
        return schema;
      }
    })
    .required(`${end_date.requiredErrorMsg}`),
  [due_date.name]: Yup.date().required(`${due_date.requiredErrorMsg}`),
  [gl_account.name]: Yup.string().trim().required(`${gl_account.requiredErrorMsg}`),
  [secondary_tenants.name]: Yup.array().of(
    Yup.object().shape(
      {
        [secondary_tenants.first_name.name]: Yup.string()
          .trim()
          .when(
            [
              secondary_tenants.last_name.name,
              secondary_tenants.tax_payer_id.name,
              secondary_tenants.email.name,
              secondary_tenants.phone_number.name,
              secondary_tenants.birthday.name,
              secondary_tenants.description.name,
            ],
            {
              is: (
                last_name?: string,
                tax_payer_id?: string,
                email?: string,
                phone_number?: string,
                birthday?: string,
                description?: string
              ) => last_name || tax_payer_id || email || phone_number || birthday || description,
              then: schema => schema.required(`${secondary_tenants.first_name.requiredErrorMsg}`),
            }
          ),
        [secondary_tenants.last_name.name]: Yup.string()
          .trim()
          .when(
            [
              secondary_tenants.first_name.name,
              secondary_tenants.tax_payer_id.name,
              secondary_tenants.email.name,
              secondary_tenants.phone_number.name,
              secondary_tenants.birthday.name,
              secondary_tenants.description.name,
            ],
            {
              is: (
                first_name?: string,
                tax_payer_id?: string,
                email?: string,
                phone_number?: string,
                birthday?: string,
                description?: string
              ) => first_name || tax_payer_id || email || phone_number || birthday || description,
              then: schema => schema.required(`${secondary_tenants.last_name.requiredErrorMsg}`),
            }
          ),
        [secondary_tenants.tax_payer_id.name]: Yup.string()
          .trim()
          .when(
            [
              secondary_tenants.first_name.name,
              secondary_tenants.last_name.name,
              secondary_tenants.email.name,
              secondary_tenants.phone_number.name,
              secondary_tenants.birthday.name,
              secondary_tenants.description.name,
            ],
            {
              is: (
                first_name?: string,
                last_name?: string,
                email?: string,
                phone_number?: string,
                birthday?: string,
                description?: string
              ) => first_name || last_name || email || phone_number || birthday || description,
              then: schema => schema.required(`${secondary_tenants.tax_payer_id.requiredErrorMsg}`),
            }
          ),
        [secondary_tenants.email.name]: Yup.string()
          .trim()
          .email()
          .when(
            [
              secondary_tenants.first_name.name,
              secondary_tenants.last_name.name,
              secondary_tenants.tax_payer_id.name,
              secondary_tenants.phone_number.name,
              secondary_tenants.birthday.name,
              secondary_tenants.description.name,
            ],
            {
              is: (
                first_name?: string,
                last_name?: string,
                tax_payer_id?: string,
                phone_number?: string,
                birthday?: string,
                description?: string
              ) => first_name || last_name || tax_payer_id || phone_number || birthday || description,
              then: schema => schema.required(`${secondary_tenants.email.requiredErrorMsg}`),
            }
          ),
        [secondary_tenants.phone_number.name]: yupPhoneInput.when(
          [
            secondary_tenants.first_name.name,
            secondary_tenants.last_name.name,
            secondary_tenants.tax_payer_id.name,
            secondary_tenants.email.name,
            secondary_tenants.birthday.name,
            secondary_tenants.description.name,
          ],
          {
            is: (
              first_name?: string,
              last_name?: string,
              tax_payer_id?: string,
              email?: string,
              birthday?: string,
              description?: string
            ) => first_name || last_name || tax_payer_id || email || birthday || description,
            then: schema => schema.required(`${secondary_tenants.phone_number.requiredErrorMsg}`),
          }
        ),
        [secondary_tenants.birthday.name]: Yup.string()
          .trim()
          .when(
            [
              secondary_tenants.first_name.name,
              secondary_tenants.last_name.name,
              secondary_tenants.tax_payer_id.name,
              secondary_tenants.email.name,
              secondary_tenants.phone_number.name,
              secondary_tenants.description.name,
            ],
            {
              is: (
                first_name?: string,
                last_name?: string,
                tax_payer_id?: string,
                email?: string,
                phone_number?: string,
                description?: string
              ) => first_name || last_name || tax_payer_id || email || phone_number || description,
              then: schema => schema.required(`${secondary_tenants.birthday.requiredErrorMsg}`),
            }
          ),
        [secondary_tenants.description.name]: Yup.string()
          .trim()
          .when(
            [
              secondary_tenants.first_name.name,
              secondary_tenants.last_name.name,
              secondary_tenants.tax_payer_id.name,
              secondary_tenants.email.name,
              secondary_tenants.phone_number.name,
              secondary_tenants.birthday.name,
            ],
            {
              is: (
                first_name?: string,
                last_name?: string,
                tax_payer_id?: string,
                email?: string,
                phone_number?: string,
                birthday?: string
              ) => first_name || last_name || tax_payer_id || email || phone_number || birthday,
              then: schema => schema.required(`${secondary_tenants.description.requiredErrorMsg}`),
            }
          ),
      },
      [
        [secondary_tenants.first_name.name, secondary_tenants.last_name.name],
        [secondary_tenants.first_name.name, secondary_tenants.tax_payer_id.name],
        [secondary_tenants.first_name.name, secondary_tenants.email.name],
        [secondary_tenants.first_name.name, secondary_tenants.phone_number.name],
        [secondary_tenants.first_name.name, secondary_tenants.birthday.name],
        [secondary_tenants.first_name.name, secondary_tenants.description.name],

        [secondary_tenants.last_name.name, secondary_tenants.tax_payer_id.name],
        [secondary_tenants.last_name.name, secondary_tenants.email.name],
        [secondary_tenants.last_name.name, secondary_tenants.phone_number.name],
        [secondary_tenants.last_name.name, secondary_tenants.birthday.name],
        [secondary_tenants.last_name.name, secondary_tenants.description.name],

        [secondary_tenants.tax_payer_id.name, secondary_tenants.email.name],
        [secondary_tenants.tax_payer_id.name, secondary_tenants.phone_number.name],
        [secondary_tenants.tax_payer_id.name, secondary_tenants.birthday.name],
        [secondary_tenants.tax_payer_id.name, secondary_tenants.description.name],

        [secondary_tenants.email.name, secondary_tenants.phone_number.name],
        [secondary_tenants.email.name, secondary_tenants.birthday.name],
        [secondary_tenants.email.name, secondary_tenants.description.name],

        [secondary_tenants.phone_number.name, secondary_tenants.birthday.name],
        [secondary_tenants.phone_number.name, secondary_tenants.description.name],

        [secondary_tenants.birthday.name, secondary_tenants.description.name],
      ]
    )
  ),

  [amount.name]: Yup.number().positive().required(amount.requiredErrorMsg),
  [rent_cycle.name]: Yup.string()
    .trim()
    .oneOf(['WEEKLY', 'MONTHLY', 'QUARTERLY', 'SIX_MONTHS', 'YEARLY'])
    .required(rent_cycle.requiredErrorMsg),

  [security_deposit_amount.name]: Yup.number(),

  [charge_title.name]: Yup.string().trim(),
  [charge_account.name]: Yup.string().trim(),
  [charge_amount.name]: Yup.number().positive(),
  [charge_description.name]: Yup.string().trim(),
  [charge_type.name]: Yup.string().trim().oneOf(['ONE_TIME', 'RECURRING']),
});
