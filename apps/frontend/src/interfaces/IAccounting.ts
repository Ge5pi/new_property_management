import { IAttachments } from './IAttachments';
import { IPropertyAPI } from './IProperties';
import { ITenantAPI } from './ITenant';
import { IUnitsAPI } from './IUnits';

export interface IChargeID {
  charge: string | number;
}

export declare type ChargeType = 'ONE_TIME' | 'RECURRING';
export declare type ChargeStatus = 'PAID' | 'UNPAID' | 'NOT_VERIFIED' | 'VERIFIED' | 'REJECTED';
export declare type IChargeAttachments = IAttachments & IChargeID;
export interface IChargesAPI {
  id?: number;
  slug?: string;
  title: string;
  description: string;
  charge_type: ChargeType;
  get_charge_type_display?: string;
  status: ChargeStatus;
  get_status_display?: string;
  amount: number;
  gl_account: string;
  tenant: number | ITenantAPI;
  parent_property: number | IPropertyAPI;
  unit_name?: string;
  property_name?: string;
  tenant_first_name?: string;
  tenant_last_name?: string;
  unit: number | IUnitsAPI;
  notes: string;
  created_at?: string;
  parent_charge?: number;
}

export interface IInvoicesAPI {
  id?: number;
  slug?: string;
  business_information?: number;
  lease: number;
  parent_property: number;
  unit: number;
  created_at?: string;
  interval_start_date: string;
  interval_end_date: string;
  due_date: string;
  rent_amount: number;
  payed_at?: string;

  payed_late_fee?: string;
  total_paid_amount?: string;

  status?: ChargeStatus;
  get_status_display?: string;
  rent_cycle?: string;
  total_charges_amount?: string;
  charges_and_rent?: string;
  is_late_fee_applicable?: boolean;
  number_of_days_late?: number;
  payment?: number;
  late_fee?: string;
  payable_late_fee?: string;
  payable_amount?: string;
  arrear_of?: string | number;
  arrears_amount?: string | number;
  tenant_first_name?: string;
  tenant_last_name?: string;
}

export interface IParentTenantPayment {
  payment: string | number;
}

export declare type ITenantPaymentAttachments = IAttachments & IParentTenantPayment;
export declare type TenantPaymentType = 'BANK_TRANSFER' | 'CARD';
export interface ITenantPayments {
  id?: number;
  invoice: number;
  amount: number | string;
  payment_method: TenantPaymentType;
  invoice_slug?: string;
  get_payment_method_display?: string;
  payment_date: string;
  status?: ChargeStatus;
  get_status_display?: string;
  account?: string | number;
  remarks?: string;
  notes?: string;
}

export interface IBankAccountID {
  account: string | number;
}

export declare type IBankAccountAttachments = IAttachments & IBankAccountID;
export interface IBankAccounts {
  id?: string | number;
  bank_name: string;
  branch_name: string;
  branch_code: string;
  account_title: string;
  account_number: string;
  iban: string;
  address?: string;
  description?: string;
  notes?: string;
}

export declare type GeneralLedgerAccountType = 'ASSET' | 'LIABILITY' | 'EQUITY' | 'INCOME' | 'EXPENSE';
export declare type GeneralLedgerSubAccountType =
  | 'RECEIVABLES'
  | 'INVENTORY'
  | 'FIXED_ASSETS'
  | 'CASH_OR_BANK'
  | 'CURRENT_LIABILITY'
  | 'NON_CURRENT_LIABILITY'
  | 'DRAWINGS'
  | 'DIRECT_INCOME'
  | 'INDIRECT_INCOME';
export interface IGeneralLedgerAccount {
  id?: string | number;
  account_holder_content_type: number;
  account_holder_object_id: number;
  account_type: GeneralLedgerAccountType;
  get_account_type_display?: string;
  sub_account_type: GeneralLedgerSubAccountType;
  get_sub_account_type_display?: string;
  created_at?: string;
  account_holder_content_type_name?: string;
}

export declare type GeneralLedgerTransactionType = 'DEBIT' | 'CREDIT';
export interface IGeneralLedgerTransaction {
  id?: string | number;
  transaction_type?: GeneralLedgerTransactionType;
  get_transaction_type_display?: string;
  description: string;
  amount: string;
  gl_account?: number;
  created_at?: string;
}
