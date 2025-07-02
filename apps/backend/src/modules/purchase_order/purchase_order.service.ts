import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PurchaseOrder } from '../../generated/types';

export async function findAllPurchaseOrders() {
  return await db.$kysely.selectFrom('PurchaseOrder').selectAll().execute();
}

export async function createPurchaseOrder(purchaseOrderData: Insertable<PurchaseOrder>) {
  return await db.$kysely.insertInto('PurchaseOrder').values(purchaseOrderData).returningAll().executeTakeFirstOrThrow();
}

export async function findPurchaseOrderById(id: string) {
  return await db.$kysely.selectFrom('PurchaseOrder').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePurchaseOrder(id: string, purchaseOrderData: Updateable<PurchaseOrder>) {
  return await db.$kysely.updateTable('PurchaseOrder').set(purchaseOrderData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePurchaseOrder(id: string) {
  const result = await db.$kysely.deleteFrom('PurchaseOrder').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
