import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PurchaseOrderAttachment } from '../../generated/types';

export async function findAllPurchaseOrderAttachments() {
  return await db.$kysely.selectFrom('PurchaseOrderAttachment').selectAll().execute();
}

export async function createPurchaseOrderAttachment(purchaseOrderAttachmentData: Insertable<PurchaseOrderAttachment>) {
  return await db.$kysely.insertInto('PurchaseOrderAttachment').values(purchaseOrderAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findPurchaseOrderAttachmentById(id: string) {
  return await db.$kysely.selectFrom('PurchaseOrderAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePurchaseOrderAttachment(id: string, purchaseOrderAttachmentData: Updateable<PurchaseOrderAttachment>) {
  return await db.$kysely.updateTable('PurchaseOrderAttachment').set(purchaseOrderAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePurchaseOrderAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('PurchaseOrderAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
