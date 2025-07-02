import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Unit } from '../../../prisma/generated/types';

export async function findAllUnits() {
  return await db.$kysely.selectFrom('Unit').selectAll().execute();
}

export async function createUnit(unitData: Insertable<Unit>) {
  return await db.$kysely.insertInto('Unit').values(unitData).returningAll().executeTakeFirstOrThrow();
}

export async function findUnitById(id: string) {
  return await db.$kysely.selectFrom('Unit').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateUnit(id: string, unitData: Updateable<Unit>) {
  return await db.$kysely.updateTable('Unit').set(unitData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUnit(id: string) {
  const result = await db.$kysely.deleteFrom('Unit').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
