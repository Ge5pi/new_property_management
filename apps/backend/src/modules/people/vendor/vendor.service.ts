import { db } from '../../../database';
import { Insertable, Updateable } from 'kysely';
import { Vendor } from '../../../generated/types';

export async function findAllVendors() {
  return await db.$kysely.selectFrom('Vendor').selectAll().execute();
}

export async function createVendor(vendorData: any) {
  return await db.$kysely.insertInto('Vendor').values(vendorData).returningAll().executeTakeFirstOrThrow();
}

export async function findVendorById(id: string) {
  return await db.$kysely.selectFrom('Vendor').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateVendor(id: string, vendorData: any) {
  return await db.$kysely.updateTable('Vendor').set(vendorData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteVendor(id: string) {
  const result = await db.$kysely.deleteFrom('Vendor').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
