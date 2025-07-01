export interface IRentableItems {
  id?: string | number;
  name: string;
  description?: string;
  amount: number;
  gl_account: string;
  parent_property: number;
  tenant: number;
  tenant_first_name?: string;
  tenant_last_name?: string;
  status?: boolean;
}
