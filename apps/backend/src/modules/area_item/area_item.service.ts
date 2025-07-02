import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { AreaItem } from '../../../prisma/generated/types';

export async function findAllAreaItems() {
  return await db.$kysely.selectFrom('AreaItem').selectAll().execute();
}

export async function createAreaItem(areaItemData: Insertable<AreaItem>) {
  return await db.$kysely.insertInto('AreaItem').values(areaItemData).returningAll().executeTakeFirstOrThrow();
}

export async function findAreaItemById(id: string) {
  return await db.$kysely.selectFrom('AreaItem').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateAreaItem(id: string, areaItemData: Updateable<AreaItem>) {
  return await db.$kysely.updateTable('AreaItem').set(areaItemData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteAreaItem(id: string) {
  const result = await db.$kysely.deleteFrom('AreaItem').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
