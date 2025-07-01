import { ChargeType } from './IAccounting';
import { IAttachments } from './IAttachments';
import { IEmail, IPhone } from './IGeneral';
import { IPropertyAPI } from './IProperties';
import { IUnitsAPI } from './IUnits';

export interface IParentRentalApplication {
  rental_application?: number;
}

export interface IParentLease {
  lease?: number;
}

export declare type ApplicantType = 'FINANCIALlY_INDEPENDENT' | 'DEPENDENT';

export declare type RentalStatusType = 'DRAFT' | 'PENDING' | 'APPROVED' | 'REJECTED' | 'ON_HOLD_OR_WAITING';
export declare type IRentalAttachments = IAttachments & IParentRentalApplication;

export declare type LeaseType = 'FIXED' | 'AT_WILL';
export declare type LeaseStatusType = 'ACTIVE' | 'CLOSED' | 'PENDING' | 'REJECTED';
export declare type LeaseRentCycle = 'WEEKLY' | 'MONTHLY' | 'QUARTERLY' | 'SIX_MONTHS' | 'YEARLY';

export interface IRentalApplicationForm {
  id?: string | number;
  slug?: string;
  applicant: number | string;
  application_type: ApplicantType;
  desired_move_in_date: string;
  legal_first_name: string;
  middle_name: string;
  legal_last_name: string;
  lease_id?: number;
  status?: RentalStatusType;
  notes?: string;
  birthday?: string;
  ssn_or_tin?: string;
  driving_license_number?: string;
  employer_name?: string;
  employer_address?: string;
  employer_phone_number?: string;
  employment_city?: string;
  employment_zip_code?: string;
  employment_country?: string;
  monthly_salary?: string;
  position_held?: string;
  years_worked?: number;
  supervisor_name?: string;
  supervisor_title?: string;
  supervisor_phone_number?: string;
  supervisor_email?: string;
  is_defendant_in_any_lawsuit?: boolean;
  is_convicted?: boolean;
  have_filed_case_against_landlord?: boolean;
  is_smoker?: boolean;

  emergency_contacts: Array<IRentalEmergencyContact>;
  residential_history?: Array<IRentalResidentialHistory>;
  financial_information?: Array<IRentalFinancialInformation>;
  additional_income?: Array<IRentalAdditionalIncome>;
  dependents?: Array<IRentalDependents>;
  pets?: Array<IRentalPets>;

  attachments?: Array<IRentalAttachments>;

  is_general_info_filled?: boolean;
  is_personal_details_filled?: boolean;
  is_rental_history_filled?: boolean;
  is_financial_info_filled?: boolean;
  is_dependents_filled?: boolean;
  is_other_info_filled?: boolean;

  general_info?: boolean;
  personal_details?: boolean;
  rental_history?: boolean;
  financial_info?: boolean;
  dependents_info?: boolean;
  other_info?: boolean;
}

export interface IRentalFormContactDetails extends IRentalApplicationForm {
  phone_number?: Array<IPhone>;
  emails: Array<IEmail>;
}

export interface ISingleRentalForm extends IRentalApplicationForm {
  phone_number?: Array<string>;
  emails: Array<string>;
}

export interface IRentalEmergencyContact extends IParentRentalApplication {
  id?: string | number;
  name?: string;
  phone_number?: string;
  relationship?: string;
  address?: string;
}

export interface IRentalResidentialHistory extends IParentRentalApplication {
  id?: string | number;
  current_address: string;
  current_address_2?: string;
  current_city?: string;
  current_zip_code?: string;
  current_country: string;
  current_state: string;
  monthly_rent: string;
  resident_from?: string;
  resident_to?: string;
  landlord_name?: string;
  landlord_phone_number?: string;
  landlord_email?: string;
  reason_of_leaving?: string;
}

export interface IRentalFinancialInformation extends IParentRentalApplication {
  id?: string | number;
  account_type: string;
  account_number: string;
  bank: string;
  name: string;
}

export interface IRentalAdditionalIncome extends IParentRentalApplication {
  id?: string | number;
  monthly_income: string;
  source_of_income: string;
}

export interface IRentalDependents extends IParentRentalApplication {
  id?: string | number;
  first_name: string;
  last_name: string;
  birthday: string;
  relationship: string;
}

export interface IRentalPets extends IParentRentalApplication {
  id?: string | number;
  name: string;
  pet_type: string;
  weight?: string;
  age?: string;
}

export interface IApplicantForm extends IParentRentalApplication {
  id?: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  allow_email_for_rental_application?: boolean;
  status_percentage?: number;
  rental_application?: number;

  property_rental_application_template?: number;
  property_id?: number | IPropertyAPI;
  unit: number | IUnitsAPI;

  property_name?: string;
  unit_name?: string;
}

export interface ILeaseAPI {
  id?: string | number;
  start_date: string;
  end_date: string;
  rent_cycle: LeaseRentCycle;
  get_rent_cycle_display?: string;
  amount: number;
  lease_template?: number;
  gl_account: string;
  description?: string;
  due_date: string;

  property_name?: string;
  property_id?: IPropertyAPI | number;

  unit_name?: string;
  unit?: IUnitsAPI | number;

  applicant_id?: number;

  primary_tenant?: number;
  tenant_first_name?: string;
  tenant_last_name?: string;
  owners?: Array<string>;
  status?: LeaseStatusType;
  get_status_display?: string;
}

export interface ILeaseForm extends ILeaseAPI {
  lease_type: LeaseType;
  rental_application?: number | ISingleRentalForm;
  get_lease_type_display?: string;
  closed_on?: string;

  security_deposit_date?: string;
  security_deposit_amount?: number;

  applicant: number | IApplicantForm;
}

export interface ILeaseCharges {
  id?: string | number;
  charge_title: string;
  charge_description: string;
  charge_amount: string;
  charge_account: string;
  charge_type: ChargeType;
  recurring_charge_title: string;
  recurring_charge_description: string;
  recurring_charge_amount: string;
  recurring_charge_frequency: string;
  recurring_charge_account: string;
}

export interface ISecondaryTenant extends IParentLease {
  id?: string | number;
  first_name: string;
  last_name: string;
  birthday: string;
  email: string;
  phone_number: string;
  tax_payer_id: string;
  description?: string;
}

export interface IRentalTemplate {
  id?: string | number;
  name: string;
  description?: string;
  general_info?: boolean;
  personal_details?: boolean;
  rental_history?: boolean;
  financial_info?: boolean;
  dependents_info?: boolean;
  other_info?: boolean;
}

export interface IRulesPolicy {
  rule?: string;
}

export interface ICondition {
  condition?: string;
}

export interface IPolicy {
  policy?: string;
}

export interface ILeaseTemplate {
  id?: string | number;
  name: string;
  description: string;
  final_statement?: string;
  right_of_inspection?: boolean;
}

export interface ILeaseTemplateWithObjects extends ILeaseTemplate {
  rules_and_policies?: Array<IRulesPolicy>;
  condition_of_premises?: Array<ICondition>;
  conditions_of_moving_out?: Array<ICondition>;
  releasing_policies?: Array<IPolicy>;
}

export interface ISingleLeaseTemplate extends ILeaseTemplate {
  rules_and_policies?: Array<string>;
  condition_of_premises?: Array<string>;
  conditions_of_moving_out?: Array<string>;
  releasing_policies?: Array<string>;
}
