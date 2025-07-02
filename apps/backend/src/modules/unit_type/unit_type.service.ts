import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { UnitType } from '../../../prisma/generated/types';

export async function findAllUnitTypes() {
  return await db.$kysely.selectFrom('UnitType').selectAll().execute();
}

export async function createUnitType(unitTypeData: Insertable<UnitType>) {
  return await db.$kysely.insertInto('UnitType').values(unitTypeData).returningAll().executeTakeFirstOrThrow();
}

export async function findUnitTypeById(id: string) {
  return await db.$kysely.selectFrom('UnitType').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateUnitType(id: string, unitTypeData: Updateable<UnitType>) {
  return await db.$kysely.updateTable('UnitType').set(unitTypeData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUnitType(id: string) {
  const result = await db.$kysely.deleteFrom('UnitType').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
