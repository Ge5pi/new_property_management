import { IFilterOptions } from './IGeneral';
import { IPhoto } from './IPhotos';
import { IPropertyOwner } from './IProperties';
import { IListUnits } from './IUnits';
import { WorkOrderStatus, WorkOrderType } from './IWorkOrders';

export declare type PriorityType = 'URGENT' | 'NORMAL' | 'LOW';
export declare type IServiceUnit = IListUnits & { property_name: string };
export interface IServiceRequestFilter extends IFilterOptions {
  priority?: PriorityType | '';
  order_type?: WorkOrderType | '';
  work_order_status?: WorkOrderStatus | '';
  status?: 'OPEN' | 'COMPLETED' | '';
}

export interface IServiceRequestAPI {
  id?: number | string;
  slug?: string;
  status?: 'PENDING' | 'COMPLETED';
  unit: IServiceUnit | number;
  subject: string;
  description: string;
  permission_to_enter?: boolean;
  additional_information_for_entry?: string;
  priority: PriorityType;
  order_type: WorkOrderType;
  get_order_type_display?: string;
  property_id?: number;
  tenant_id?: number;
}

export interface IPropertyForRequest {
  id?: number;
  name: string;
  maintenance_limit_amount?: string;
  owners?: Array<IPropertyOwner>;
}

export interface IListServiceRequest extends Partial<IServiceRequestAPI> {
  work_order_count: string;
  property_name?: string;
  unit_cover_picture?: IPhoto;
  unit_name?: string;
}

export interface ISingleServiceRequest extends IServiceRequestAPI {
  get_priority_display?: string;
}
