import { GenericQueryHookResult } from 'services/api/types/rtk-query';

import { CommissionType, FeeType, PaymentType } from './IAssets';
import { IAttachments } from './IAttachments';
import { ChargesType, GracePeriodType, IAmenities, IFilterOptions, IIDName, RenewalChargeType } from './IGeneral';
import { ISinglePeopleOwner } from './IPeoples';
import { IPhoto } from './IPhotos';
import { IUpcomingActivities } from './IUpcomingActivities';

export declare type PropertyStatus = 'VACANT' | 'OCCUPIED';
export interface IPropertyStatus {
  property_type?: string | '';
  is_occupied?: 'true' | 'false' | '';
}

export declare type IPhotoPropertyID = IPhoto & IParentProperty;
export declare type IPropertyFilter = IFilterOptions & IPropertyStatus;
export interface IParentProperty {
  parent_property: number;
}

export declare type IPropertyAttachments = IAttachments & IParentProperty;
export declare type IPropertyUpcomingActivities = IUpcomingActivities & IParentProperty;

export declare type SinglePropertyResponseType = GenericQueryHookResult<number, ISingleProperty>;

export interface IPropertyAPI {
  id?: number;
  name: string;
  address: string;
  property_type: number | string;
  rental_application_template?: number;
  cover_picture?: string;
  cover_picture_id?: number;
}

export interface IListProperties extends IPropertyAPI {
  owner_peoples: Array<ISinglePeopleOwner>;
  number_of_units?: string;
  is_occupied?: boolean;
}

export interface IUtilityBills extends IParentProperty {
  id?: number;
  utility: string;
  vendor: number;
  vendor_bill_gl: string;
  tenant_charge_gl: string;
  owner_contribution_percentage: number;
  tenant_contribution_percentage: number;
}

export interface ILateFeePolicy extends IParentProperty {
  id?: number;
  start_date: string;
  end_date: string;
  late_fee_type: FeeType;
  get_late_fee_type_display?: string;
  base_amount_fee: string;
  eligible_charges: ChargesType;
  get_eligible_charges_display: string;
  charge_daily_late_fees: boolean;
  daily_amount_per_month_max: string;
  grace_period_type: GracePeriodType;
  grace_period: number;
}

export interface ISingleProperty extends IListProperties, IAmenities {
  id?: number;
  description?: string;
  property_type: number | string;
  property_type_name?: string;
  late_fee_base_amount?: string | number;
  renters_tax_location_code?: string;
  property_owner_license?: string;
  year_built?: number;
  management_start_date?: string;
  management_end_date?: string;
  management_end_reason?: IIDName;
  nsf_fee?: string;
  management_fees_amount?: string;
  management_fees_percentage?: number;
  management_commission_type?: CommissionType;
  additional_fees_gl_account?: string;
  additional_fees_percentage?: number;
  addition_fees_suppress?: boolean;
  notes?: string;
  tax_authority?: string;
  portfolio?: string;
  lease_fees_amount?: string;
  lease_fees_percentage?: number;
  lease_fees_commission_type?: CommissionType;
  maintenance_limit_amount?: string;
  insurance_expiration_date?: string;
  has_home_warranty_coverage?: boolean;
  home_warranty_company?: string;
  home_warranty_expiration_date?: string;
  maintenance_notes?: string;
  lease_template?: number;
  default_lease_template?: string | number;
  default_lease_agenda?: string;

  default_lease_attachment?: string;

  default_lease_renewal_template?: string | number;
  default_lease_renewal_agenda?: string;
  default_lease_renewal_letter_template?: string | number;

  default_lease_renewal_attachment?: string;

  default_renewal_additional_fee: number;
  default_renewal_charge_by: number;
  default_renewal_terms: RenewalChargeType;
  property_groups?: Array<IIDName>;
  late_fee_policy?: number;
  parent_property?: number;
}

export interface IPropertyOwner extends IParentProperty {
  id?: number;
  first_name?: string;
  last_name?: string;
  owner: ISinglePeopleOwner | number;
  percentage_owned: number;
  payment_type: PaymentType;
  get_payment_type_display?: string;
  reserve_funds: string | number;
  contract_expiry: string;
  fiscal_year_end: string;
  ownership_start_date: string;
}

export interface IIncreaseRentAPI {
  id?: string | number;
  rent_increase: string;
  rent_increase_type: CommissionType;
  schedule_increase: boolean;
  schedule_increase_date: string;
  parent_property: string | number;
}
