import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { VendorType } from '../../generated/types';

export async function findAllVendorTypes() {
  return await db.$kysely.selectFrom('VendorType').selectAll().execute();
}

export async function createVendorType(vendorTypeData: Insertable<VendorType>) {
  return await db.$kysely.insertInto('VendorType').values(vendorTypeData).returningAll().executeTakeFirstOrThrow();
}

export async function findVendorTypeById(id: string) {
  return await db.$kysely.selectFrom('VendorType').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateVendorType(id: string, vendorTypeData: Updateable<VendorType>) {
  return await db.$kysely.updateTable('VendorType').set(vendorTypeData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteVendorType(id: string) {
  const result = await db.$kysely.deleteFrom('VendorType').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
