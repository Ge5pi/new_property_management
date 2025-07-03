import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Inventory } from '../../generated/types';

export async function findAllInventory() {
  return await db.$kysely.selectFrom('Inventory').selectAll().execute();
}

export async function createInventory(inventoryData: any) {
  return await db.$kysely.insertInto('Inventory').values(inventoryData).returningAll().executeTakeFirstOrThrow();
}

export async function findInventoryById(id: string) {
  return await db.$kysely.selectFrom('Inventory').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateInventory(id: string, inventoryData: any) {
  return await db.$kysely.updateTable('Inventory').set(inventoryData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteInventory(id: string) {
  const result = await db.$kysely.deleteFrom('Inventory').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
