import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentableItem } from '../../generated/types';

export async function findAllRentableItems() {
  return await db.$kysely.selectFrom('RentableItem').selectAll().execute();
}

export async function createRentableItem(rentableItemData: Insertable<RentableItem>) {
  return await db.$kysely.insertInto('RentableItem').values(rentableItemData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentableItemById(id: string) {
  return await db.$kysely.selectFrom('RentableItem').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentableItem(id: string, rentableItemData: Updateable<RentableItem>) {
  return await db.$kysely.updateTable('RentableItem').set(rentableItemData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentableItem(id: string) {
  const result = await db.$kysely.deleteFrom('RentableItem').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
