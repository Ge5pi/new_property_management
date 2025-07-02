import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Area } from '../../../prisma/generated/types';

export async function findAllAreas() {
  return await db.$kysely.selectFrom('Area').selectAll().execute();
}

export async function createArea(areaData: Insertable<Area>) {
  return await db.$kysely.insertInto('Area').values(areaData).returningAll().executeTakeFirstOrThrow();
}

export async function findAreaById(id: string) {
  return await db.$kysely.selectFrom('Area').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateArea(id: string, areaData: Updateable<Area>) {
  return await db.$kysely.updateTable('Area').set(areaData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteArea(id: string) {
  const result = await db.$kysely.deleteFrom('Area').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
