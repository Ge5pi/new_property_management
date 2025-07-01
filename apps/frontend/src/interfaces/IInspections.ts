import { IPhoto } from './IPhotos';
import { IListUnits } from './IUnits';

export declare type InspectionCondition = 'OKAY' | 'NOT_OKAY';
export interface IInspectionsAPI {
  id?: number | string;
  slug?: string;
  property_name?: string;
  unit_name?: string;
  unit_cover_picture?: IPhoto;
  unit: IListUnits | number;
  name: string;
  date: string;
}

export interface IInspectionArea {
  id?: number | string;
  name: string;
  inspection: number;
}

export interface IInspectionAreaItem {
  id?: number | string;
  name: string;
  condition: InspectionCondition;
  area: number;
}
