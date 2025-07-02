import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { UnitUpcomingActivity } from '../../generated/types';

export async function findAllUnitUpcomingActivities() {
  return await db.$kysely.selectFrom('UnitUpcomingActivity').selectAll().execute();
}

export async function createUnitUpcomingActivity(unitUpcomingActivityData: Insertable<UnitUpcomingActivity>) {
  return await db.$kysely.insertInto('UnitUpcomingActivity').values(unitUpcomingActivityData).returningAll().executeTakeFirstOrThrow();
}

export async function findUnitUpcomingActivityById(id: string) {
  return await db.$kysely.selectFrom('UnitUpcomingActivity').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateUnitUpcomingActivity(id: string, unitUpcomingActivityData: Updateable<UnitUpcomingActivity>) {
  return await db.$kysely.updateTable('UnitUpcomingActivity').set(unitUpcomingActivityData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteUnitUpcomingActivity(id: string) {
  const result = await db.$kysely.deleteFrom('UnitUpcomingActivity').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
