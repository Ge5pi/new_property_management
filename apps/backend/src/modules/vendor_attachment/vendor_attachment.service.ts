import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { VendorAttachment } from '../../generated/types';

export async function findAllVendorAttachments() {
  return await db.$kysely.selectFrom('VendorAttachment').selectAll().execute();
}

export async function createVendorAttachment(vendorAttachmentData: Insertable<VendorAttachment>) {
  return await db.$kysely.insertInto('VendorAttachment').values(vendorAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findVendorAttachmentById(id: string) {
  return await db.$kysely.selectFrom('VendorAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateVendorAttachment(id: string, vendorAttachmentData: Updateable<VendorAttachment>) {
  return await db.$kysely.updateTable('VendorAttachment').set(vendorAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteVendorAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('VendorAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
