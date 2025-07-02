import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyPhoto } from '../../generated/types';

export async function findAllPropertyPhotos() {
  return await db.$kysely.selectFrom('PropertyPhoto').selectAll().execute();
}

export async function createPropertyPhoto(propertyPhotoData: Insertable<PropertyPhoto>) {
  return await db.$kysely.insertInto('PropertyPhoto').values(propertyPhotoData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyPhotoById(id: string) {
  return await db.$kysely.selectFrom('PropertyPhoto').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyPhoto(id: string, propertyPhotoData: Updateable<PropertyPhoto>) {
  return await db.$kysely.updateTable('PropertyPhoto').set(propertyPhotoData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyPhoto(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyPhoto').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
