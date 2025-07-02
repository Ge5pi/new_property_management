import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyOwner } from '../../generated/types';

export async function findAllPropertyOwners() {
  return await db.$kysely.selectFrom('PropertyOwner').selectAll().execute();
}

export async function createPropertyOwner(propertyOwnerData: Insertable<PropertyOwner>) {
  return await db.$kysely.insertInto('PropertyOwner').values(propertyOwnerData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyOwnerById(id: string) {
  return await db.$kysely.selectFrom('PropertyOwner').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyOwner(id: string, propertyOwnerData: Updateable<PropertyOwner>) {
  return await db.$kysely.updateTable('PropertyOwner').set(propertyOwnerData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyOwner(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyOwner').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
