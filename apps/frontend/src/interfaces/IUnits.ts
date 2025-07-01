import { IAmenities } from './IGeneral';
import { IPhoto } from './IPhotos';
import { IParentProperty } from './IProperties';
import { IUpcomingActivities } from './IUpcomingActivities';

export interface IParentUnitType {
  unit_type: number;
}

export interface IParentUnit {
  unit: number;
}

export declare type IPhotoUnitID = IPhoto & IParentUnit;
export declare type IPhotoUnitTypeID = IPhoto & IParentUnitType;
export declare type IUnitsUpcomingActivities = IUpcomingActivities & IParentUnit;

export interface IUnitTypeIndependentFields {
  market_rent?: number;
  future_market_rent?: number;
  effective_date?: string;
  application_fee?: string;
  estimate_turn_over_cost?: string;
}

export interface IUnitTypeAPI extends IParentProperty {
  id?: number;
  slug?: string;
  name: string;
  cover_picture?: string;
  cover_picture_id?: number;
}

export interface IListUnitTypes extends IUnitTypeAPI, IUnitTypeIndependentFields {
  bed_rooms?: number;
  bath_rooms?: number;
  square_feet?: number;
}

export interface ISingleUnitType extends IListUnitTypes, IAmenities {
  marketing_title?: string;
  marketing_description?: string;
  marketing_youtube_url?: string;
  unit_id?: string | number;
  apply_on_all_units?: boolean;
  tags?: Array<number>;
}

export interface IUnitsAPI extends IParentProperty, IUnitTypeIndependentFields {
  id?: number;
  slug?: string;
  name: string;
  unit_type: number;
  unit_type_name?: string;
  cover_picture?: string;
  cover_picture_id?: number;
  address?: string;
}

export interface IListUnits extends IUnitsAPI {
  is_occupied?: boolean;
  lease_start_date?: string;
  lease_end_date?: string;
  tenant_first_name?: string;
  tenant_last_name?: string;
}

export interface ISingleUnit extends IListUnits {
  tenant_id?: number;
  ready_for_show_on?: string;
  virtual_showing_available?: boolean;
  utility_bills?: boolean;
  utility_bills_date?: string;
  lock_box?: string;
  description?: string;
  tags?: Array<number>;
  non_revenues_status: boolean;
  lease_start_date: string;
  lease_end_date: string;
  balance: string;
  total_charges: string;
  total_credit: string;
  due_amount: string;
  total_payable: string;
  image: boolean;
}
