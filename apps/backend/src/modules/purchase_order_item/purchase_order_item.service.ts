import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PurchaseOrderItem } from '../../generated/types';

export async function findAllPurchaseOrderItems() {
  return await db.$kysely.selectFrom('PurchaseOrderItem').selectAll().execute();
}

export async function createPurchaseOrderItem(purchaseOrderItemData: Insertable<PurchaseOrderItem>) {
  return await db.$kysely.insertInto('PurchaseOrderItem').values(purchaseOrderItemData).returningAll().executeTakeFirstOrThrow();
}

export async function findPurchaseOrderItemById(id: string) {
  return await db.$kysely.selectFrom('PurchaseOrderItem').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePurchaseOrderItem(id: string, purchaseOrderItemData: Updateable<PurchaseOrderItem>) {
  return await db.$kysely.updateTable('PurchaseOrderItem').set(purchaseOrderItemData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePurchaseOrderItem(id: string) {
  const result = await db.$kysely.deleteFrom('PurchaseOrderItem').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
