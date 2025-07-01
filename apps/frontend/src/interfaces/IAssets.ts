import { IInventoryAPI } from './IInventory';
import { IPropertyAPI } from './IProperties';
import { IUnitsAPI } from './IUnits';

export declare type CommissionType = 'percentage' | 'fixed';
export declare type FixedAssetStatus = 'in_storage' | 'installed';
export declare type PaymentType = 'flat' | 'net_income';
export declare type FeeType = 'percentage' | 'flat';

export interface IFixedAssets {
  id?: number;
  slug?: string;
  status: FixedAssetStatus;
  get_status_display?: string;
  placed_in_service_date: string;
  warranty_expiration_date: string;
  unit: number | IUnitsAPI;
  unit_name?: string;
  property_name?: string;
  inventory_name?: string;
  inventory_location?: string;
  total_cost?: string;
  inventory_item: number | IInventoryAPI;
  property_id?: number | IPropertyAPI;
  quantity: number;
  cost: number;
}

export interface IImportFixedAssetsItems {
  Status: string;
  'Inventory Item': number;
  'Placed In Service Date': string;
  'Expiration Date': string;
  Quantity: number;
}

export interface IImportProcessedFixedAssetsItems {
  status: FixedAssetStatus;
  inventory_item: number;
  placed_in_service_date: string;
  warranty_expiration_date: string;
  quantity: number;
}
