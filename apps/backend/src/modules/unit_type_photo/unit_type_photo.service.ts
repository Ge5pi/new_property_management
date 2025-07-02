import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { UnitTypePhoto } from '../../generated/types';

export async function findAllUnitTypePhotos() {
  return await db.$kysely.selectFrom('UnitTypePhoto').selectAll().execute();
}

export async function createUnitTypePhoto(unitTypePhotoData: Insertable<UnitTypePhoto>) {
  return await db.$kysely.insertInto('UnitTypePhoto').values(unitTypePhotoData).returningAll().executeTakeFirstOrThrow();
}

export async function findUnitTypePhotoById(id: string) {
  return await db.$kysely.selectFrom('UnitTypePhoto').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateUnitTypePhoto(id: string, unitTypePhotoData: Updateable<UnitTypePhoto>) {
  return await db.$kysely.updateTable('UnitTypePhoto').set(unitTypePhotoData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUnitTypePhoto(id: string) {
  const result = await db.$kysely.deleteFrom('UnitTypePhoto').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
