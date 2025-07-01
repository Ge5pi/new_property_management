import { IUser } from './IAvatar';
import { IFilterOptions, RecurringCycle } from './IGeneral';
import { IVendor, IVendorType } from './IPeoples';
import { IParentProperty } from './IProperties';
import { IUnitsAPI } from './IUnits';

export declare type WorkOrderStatus = 'OPEN' | 'ASSIGNED' | 'UNASSIGNED' | 'COMPLETED';
export declare type WorkOrderType = 'INTERNAL' | 'RESIDENT' | 'UNIT_TURN';

export interface IWorkOrderID {
  id: string | number;
}

export declare type IWorkOrderLabors = ILabor & { work_order: string | number };
export declare type IWorkOrderUnit = IUnitsAPI & { parent_property_name: string } & IParentProperty;

export interface IWorkOrderFilters extends IFilterOptions {
  service_request?: string | number;
  status?: WorkOrderStatus | '';
}

export interface IWorkOrdersAPI {
  slug?: string;
  id?: string | number;
  is_recurring?: boolean;
  cycle?: RecurringCycle;
  status?: WorkOrderStatus;
  order_type: WorkOrderType;
  get_order_type_display?: string;
  get_status_display?: string;
  get_cycle_display?: string;
  job_description: string;
  vendor_instructions?: string;
  vendor_trade?: string;
  vendor?: IVendor | number;
  vendor_type?: IVendorType | number;
  email_vendor?: boolean;
  owner_approved?: boolean;
  assign_to?: IUser | number | null;
  assign_to_first_name?: string;
  assign_to_last_name?: string;
  assign_to_username?: string;
  follow_up_date: string;
  created_by?: IUser;
  created_at?: string;
  service_request: number;
  property_id?: number;
  property_name?: number;
  labors?: Array<ILabor>;
  billable_items?: Array<IBillableItems>;
  unit_property_info?: IWorkOrderUnit | number;
  request_receipt?: boolean;
}

export interface ILabor {
  id?: string | number;
  title: string;
  date: string;
  hours: number;
  description: string;
}

export interface IBillableItems {
  id?: string | number;
  quantity: number;
  gl_account: string;
  statement_description: string;
  rate: number;
  total: number;
}
