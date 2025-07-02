import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { UnitTypeAmenity } from '../../generated/types';

export async function findAllUnitTypeAmenities() {
  return await db.$kysely.selectFrom('UnitTypeAmenity').selectAll().execute();
}

export async function createUnitTypeAmenity(unitTypeAmenityData: Insertable<UnitTypeAmenity>) {
  return await db.$kysely.insertInto('UnitTypeAmenity').values(unitTypeAmenityData).returningAll().executeTakeFirstOrThrow();
}

export async function findUnitTypeAmenityById(id: string) {
  return await db.$kysely.selectFrom('UnitTypeAmenity').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateUnitTypeAmenity(id: string, unitTypeAmenityData: Updateable<UnitTypeAmenity>) {
  return await db.$kysely.updateTable('UnitTypeAmenity').set(unitTypeAmenityData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUnitTypeAmenity(id: string) {
  const result = await db.$kysely.deleteFrom('UnitTypeAmenity').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
