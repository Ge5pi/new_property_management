import { IIDName } from './IGeneral';

export declare type PropertyType = IIDName & {
  items_count: number;
};

export declare type InventoryType = IIDName & {
  items_count: number;
};

export declare type ContactCategory = IIDName & {
  items_count: number;
};

export declare type InventoryLocations = IIDName & {
  items_count: number;
};

export declare type GeneralTags = IIDName & {
  items_count: number;
};

export declare type GeneralLabels = IIDName & {
  items_count: number;
};

export declare type ManagementFeeStatus = 'ACTIVE' | 'INACTIVE';
export declare type ManagementFeeType = 'FLAT_FEE' | 'BY_PERCENTAGE';
export interface IManagementFee {
  id?: string | number;
  fee_type: ManagementFeeType;
  previous_fee_type?: ManagementFeeType;
  fee: number;
  previous_fee?: number;
  gl_account: string;
  status?: ManagementFeeStatus;
  get_status_display?: string;
  created_at?: string;
}

export interface IBusinessInformation {
  id?: string | number;
  logo: File | string | null;
  name: string;
  description: string;
  building_or_office_number: string;
  street: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
  primary_email: string;
  secondary_email?: string;
  phone_number: string;
  telephone_number?: string;
  tax_identity_type: string;
  tax_payer_id: string;
}
