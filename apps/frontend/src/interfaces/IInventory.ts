import { IVendor } from './IPeoples';
import { InventoryLocations, InventoryType } from './ISettings';

export interface IInventoryAPI {
  id?: string | number;
  name: string;
  item_type?: number | InventoryType;
  description: string;
  part_number: string;
  vendor?: number | IVendor;
  quantity: number;
  expense_account: string;
  cost: number;
  location?: number | InventoryLocations;
  bin_or_shelf_number?: string;
  location_name?: string;
  item_type_name?: string;
}

export interface ISingleInventory extends IInventoryAPI {
  vendor?: IVendor;
  item_type?: InventoryType;
  location?: InventoryLocations;
}

export interface IImportInventoryItems {
  Name: string;
  Description: string;
  'Part Number': string;
  Quantity: number;
  Cost: number;
  'Bin or Shelf Number': string;
}

export interface IImportProcessedInventoryItems {
  name: string;
  description: string;
  part_number: string;
  quantity: number;
  bin_or_shelf_number: string;
  cost: number;
}
