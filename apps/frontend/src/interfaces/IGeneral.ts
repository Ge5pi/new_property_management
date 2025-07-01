export declare type ChargesType = 'every_charge' | 'all_recurring_charges' | 'only_recurring_rent';
export declare type GracePeriodType = 'number_of_days' | 'till_date_of_month' | 'no_grace_period';

export declare type RecurringCycle = 'DAILY' | 'WEEKLY' | 'MONTHLY' | 'YEARLY' | 'SIX_MONTHS';
export declare type RenewalChargeType = 'yearly' | 'monthly';

export declare type LoaderType<T> = { response: Promise<T> };
export declare type StatusError = {
  status: number | 'FETCH_ERROR' | 'PARSING_ERROR' | 'TIMEOUT_ERROR' | 'CUSTOM_ERROR';
};

export interface IPaginationArgs {
  count: number;
  next: string;
  previous: string;
  pages_count: number;
}

export interface IPaginationData<T> extends IPaginationArgs {
  results: Array<T>;
}

export interface IFilterOptions {
  search?: string;
  ordering?: string;
  page?: number;
  size?: number;
}

export interface IIDName {
  id?: string | number;
  name: string;
}

export interface IAddress {
  id?: string | number;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
}

export interface IPhone {
  phone?: string;
}

export interface IEmail {
  email?: string;
}

export interface IWebsite {
  url?: string;
}

export interface IEmergencyContact {
  full_name?: string;
  phone?: string;
  relationship?: string;
  address?: string;
}

export declare type ModelName =
  | 'authentication.Role'
  | 'authentication.User'
  | 'people.Vendor'
  | 'people.VendorType'
  | 'people.Tenant'
  | 'people.Owner'
  | 'lease.RentalApplicationTemplate'
  | 'lease.LeaseTemplate'
  | 'lease.Applicant'
  | 'system_preferences.ContactCategory'
  | 'system_preferences.InventoryItemType'
  | 'system_preferences.InventoryLocation'
  | 'system_preferences.PropertyType'
  | 'system_preferences.Tag'
  | 'system_preferences.Label'
  | 'property.Property'
  | 'property.Unit'
  | 'maintenance.Inventory'
  | 'maintenance.ServiceRequest'
  | 'maintenance.WorkOrder'
  | 'communication.EmailTemplate'
  | 'property.UnitType'
  | 'maintenance.Project'
  | 'accounting.Account';

export interface ISearchAPI {
  ids: string;
  model_label: ModelName;
}

export declare type SearchObject = IIDName & {
  slug?: string;
  description?: string;
  job_description?: string;
  subject?: string;

  username?: string;
  first_name?: string;
  last_name?: string;
  quantity?: number;
  cost?: number;

  selected_steps?: Array<string>;
  is_late_fee_policy_configured?: boolean;
  is_occupied?: boolean;

  tenant_id?: number | string;
  tenant_first_name?: number | string;
  tenant_last_name?: number | string;
};

export interface IAmenities {
  is_cat_allowed?: boolean;
  is_dog_allowed?: boolean;
  is_smoking_allowed?: boolean;
}
