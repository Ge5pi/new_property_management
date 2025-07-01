import { Option } from 'react-bootstrap-typeahead/types/types';

import { IAttachments } from './IAttachments';
import { IAddress, IEmail, IPhone } from './IGeneral';
import { IUpcomingActivities } from './IUpcomingActivities';

export interface IVendorID {
  vendor: string | number;
}

export interface IParentOwner {
  owner: string | number;
}

export declare type TaxIdentityType = 'SSN' | 'EIN';
export declare type VendorAddressType = IAddress & Partial<IVendorID>;
export declare type IVendorAttachments = IAttachments & IVendorID;
export declare type IOwnerUpcomingActivities = IUpcomingActivities & IParentOwner;

export interface IVendor {
  id?: string | number;
  slug?: string;
  first_name: string;
  last_name: string;
  company_name: string;
  use_company_name_as_display_name: boolean;
  vendor_type: number | Option[];
  vendor_type_name?: string;
  gl_account: string;
  website: string;
  addresses: Array<VendorAddressType>;
  insurance_policy_number: string;
  insurance_provide_name: string;
  insurance_expiry_date: string;
  tax_identity_type: TaxIdentityType;
  get_tax_identity_type_display?: string;
  tax_payer_id: string;
}

export interface IVendorContactDetails extends IVendor {
  personal_contact_numbers?: Array<IPhone>;
  personal_emails?: Array<IEmail>;
  business_contact_numbers?: Array<IPhone>;
  business_emails?: Array<IEmail>;
}

export interface ISinglePeopleVendor extends IVendor {
  personal_contact_numbers?: Array<string>;
  personal_emails?: Array<string>;
  business_contact_numbers?: Array<string>;
  business_emails?: Array<string>;
}

export interface IVendorType {
  id?: string | number;
  slug?: string;
  name: string;
  description: string;
  vendors_count?: string;
}

export interface IOwner {
  id?: string | number;
  slug?: string;
  first_name: string;
  last_name: string;
  company_name?: string;
  street_address?: string;
  city?: string;
  state?: string;
  zip?: string;
  country?: string;
  tax_payer: string;
  tax_payer_id: string;
  is_company_name_as_tax_payer: boolean;
  is_use_as_display_name: boolean;
  bank_name?: string;
  bank_account_number?: string;
  bank_routing_number?: string;
  bank_account_title?: string;
  bank_branch?: string;
  notes?: string;
}

export interface IOwnerContactDetails extends IOwner {
  personal_contact_numbers?: Array<IPhone>;
  personal_emails?: Array<IEmail>;
  company_contact_numbers?: Array<IPhone>;
  company_emails?: Array<IEmail>;
}

export interface ISinglePeopleOwner extends IOwner {
  personal_contact_numbers?: Array<string>;
  personal_emails?: Array<string>;
  company_contact_numbers?: Array<string>;
  company_emails?: Array<string>;
}
