import { IAttachments } from './IAttachments';
import { IEmail, IEmergencyContact, IPhone } from './IGeneral';
import { IUpcomingActivities } from './IUpcomingActivities';

export interface IBankAccount {
  bank?: string;
  account_number?: string;
  name?: string;
  account_type?: string;
}

export interface IParentTenant {
  tenant: number;
}

export interface ITenantRequestApi {
  id?: string;
  subject?: string;
  number?: number;
  date?: string;
  status: 'in-progress | closed';
}

export type TenantRequestType = 'GENERAL' | 'MAINTENANCE';
export interface ITenantRequest {
  id?: string;
  subject?: string;
  description?: string;
  request_type: TenantRequestType;
  files?: Array<IAttachments>;
  category?: string;
  is_permission?: boolean;
  is_pets?: boolean;
}

export interface ITenantRentalInvoicesApi {
  id?: string;
  invoice_number?: string;
  rent_month?: string;
  rent_cycle?: string;
  rent_amount?: number;
  due_date?: string;
  late_fee?: number;
  status: 'paid | unverified | unpaid';
}

export declare type ITenantAttachments = IAttachments & IParentTenant;
export declare type ITenantUpcomingActivities = IUpcomingActivities & IParentTenant;

export interface ITenantAPI {
  id?: string | number;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  lease: number | string;
  address?: string;
  rental_application_id: number | string;
  property_name?: string;
  unit_name?: string;
  property_id: number;
  unit_id: number;
  status?: 'past' | 'current';
}

export interface ITenantContactObject extends ITenantAPI {
  emergency_phones: Array<IPhone>;
  emergency_emails: Array<IEmail>;
  emergency_contacts: Array<IEmergencyContact>;
  bank_accounts: Array<IBankAccount>;
}

export interface ISingleTenant extends ITenantAPI {
  emergency_phones: Array<string>;
  emergency_emails: Array<string>;
  emergency_contacts: Array<IEmergencyContact>;
  bank_accounts: Array<IBankAccount>;
}
