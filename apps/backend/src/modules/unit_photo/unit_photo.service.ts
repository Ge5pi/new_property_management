import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { UnitPhoto } from '../../generated/types';

export async function findAllUnitPhotos() {
  return await db.$kysely.selectFrom('UnitPhoto').selectAll().execute();
}

export async function createUnitPhoto(unitPhotoData: Insertable<UnitPhoto>) {
  return await db.$kysely.insertInto('UnitPhoto').values(unitPhotoData).returningAll().executeTakeFirstOrThrow();
}

export async function findUnitPhotoById(id: string) {
  return await db.$kysely.selectFrom('UnitPhoto').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateUnitPhoto(id: string, unitPhotoData: Updateable<UnitPhoto>) {
  return await db.$kysely.updateTable('UnitPhoto').set(unitPhotoData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUnitPhoto(id: string) {
  const result = await db.$kysely.deleteFrom('UnitPhoto').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
