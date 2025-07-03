import { db } from '../../../database';
import { Insertable, Updateable } from 'kysely';
import { Owner } from '../../../generated/types';

export async function findAllOwners() {
  return await db.$kysely.selectFrom('Owner').selectAll().execute();
}

export async function createOwner(ownerData: any) {
  return await db.$kysely.insertInto('Owner').values(ownerData).returningAll().executeTakeFirstOrThrow();
}

export async function findOwnerById(id: string) {
  return await db.$kysely.selectFrom('Owner').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateOwner(id: string, ownerData: any) {
  return await db.$kysely.updateTable('Owner').set(ownerData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteOwner(id: string) {
  const result = await db.$kysely.deleteFrom('Owner').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
