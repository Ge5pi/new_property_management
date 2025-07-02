import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { VendorAddress } from '../../generated/types';

export async function findAllVendorAddresses() {
  return await db.$kysely.selectFrom('VendorAddress').selectAll().execute();
}

export async function createVendorAddress(vendorAddressData: Insertable<VendorAddress>) {
  return await db.$kysely.insertInto('VendorAddress').values(vendorAddressData).returningAll().executeTakeFirstOrThrow();
}

export async function findVendorAddressById(id: string) {
  return await db.$kysely.selectFrom('VendorAddress').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateVendorAddress(id: string, vendorAddressData: Updateable<VendorAddress>) {
  return await db.$kysely.updateTable('VendorAddress').set(vendorAddressData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteVendorAddress(id: string) {
  const result = await db.$kysely.deleteFrom('VendorAddress').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
