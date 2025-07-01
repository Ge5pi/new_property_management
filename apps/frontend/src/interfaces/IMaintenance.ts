import { IAttachments } from './IAttachments';
import { IUser } from './IAvatar';
import { IFilterOptions } from './IGeneral';
import { IInventoryAPI } from './IInventory';
import { IPropertyAPI } from './IProperties';
import { IUnitsAPI } from './IUnits';

export declare type PriceType = 'PERCENT' | 'FLAT';
// export declare type PurchaseOrderType = 'WO' | 'II' | 'PT';

export interface IParentPurchaseOrder {
  purchase_order: number;
}

export interface IParentServiceRequest {
  service_request: number;
}

export declare type IRequestAttachments = IAttachments & IParentServiceRequest;
export declare type IPurchaseOrderFilter = IFilterOptions & {
  vendor?: string | number;
  work_order?: string | number;
  project?: string | number;
  total_greater_than_equal?: number | string;
  total_less_than_equal?: number | string;
};

export declare type IPurchaseOrderAttachments = IAttachments & IParentPurchaseOrder;
export interface IPurchaseOrder {
  slug?: string;
  id?: string | number;
  vendor?: number;
  sub_total?: number;
  total?: number;
  vendor_first_name?: string;
  vendor_last_name?: string;
  description: string;
  created_at?: string;
  required_by_date: string;
  items: Array<IPurchaseOrderItem>;
  tax?: number;
  tax_value?: number;
  tax_charge_type?: PriceType | null;
  shipping?: number;
  shipping_value?: number;
  shipping_charge_type?: PriceType | null;
  discount?: number;
  discount_value?: number;
  discount_charge_type?: PriceType | null;
  notes: string;
}

export interface IPurchaseOrderItem extends IParentPurchaseOrder {
  id?: string | number;
  inventory_item?: number | Partial<IInventoryAPI>;
  inventory_item_name?: string;
  quantity?: number;
  cost?: number;
}

export declare type ProjectStatusType = 'PENDING' | 'IN_PROGRESS' | 'COMPLETED';

export interface IParentProject {
  project: string | number;
}

export interface IProjects {
  id?: string | number;
  name: string;
  description: string;
  status?: ProjectStatusType;
  get_status_display?: string;
  parent_property: number | IPropertyAPI;
  parent_property_name?: string;
  units?: Array<number> | Array<IUnitsAPI>;
  select_all_units: boolean;
  budget: number;
  gl_account: string;
  start_date: string;
  end_date: string;
}

export declare type IExpenseAttachments = IAttachments & {
  project_expense: number | string;
};

export interface IExpenses extends IParentProject {
  id?: string | number;
  title: string;
  amount: number;
  date: string;
  assigned_to: IUser | number;

  assign_to_first_name?: string;
  assign_to_last_name?: string;
  assign_to_username?: string;
}
