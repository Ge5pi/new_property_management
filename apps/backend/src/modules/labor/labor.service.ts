import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Labor } from '../../generated/types';

export async function findAllLabors() {
  return await db.$kysely.selectFrom('Labor').selectAll().execute();
}

export async function createLabor(laborData: Insertable<Labor>) {
  return await db.$kysely.insertInto('Labor').values(laborData).returningAll().executeTakeFirstOrThrow();
}

export async function findLaborById(id: string) {
  return await db.$kysely.selectFrom('Labor').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateLabor(id: string, laborData: Updateable<Labor>) {
  return await db.$kysely.updateTable('Labor').set(laborData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteLabor(id: string) {
  const result = await db.$kysely.deleteFrom('Labor').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
