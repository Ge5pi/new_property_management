import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyUpcomingActivity } from '../../generated/types';

export async function findAllPropertyUpcomingActivities() {
  return await db.$kysely.selectFrom('PropertyUpcomingActivity').selectAll().execute();
}

export async function createPropertyUpcomingActivity(propertyUpcomingActivityData: Insertable<PropertyUpcomingActivity>) {
  return await db.$kysely.insertInto('PropertyUpcomingActivity').values(propertyUpcomingActivityData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyUpcomingActivityById(id: string) {
  return await db.$kysely.selectFrom('PropertyUpcomingActivity').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyUpcomingActivity(id: string, propertyUpcomingActivityData: Updateable<PropertyUpcomingActivity>) {
  return await db.$kysely.updateTable('PropertyUpcomingActivity').set(propertyUpcomingActivityData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyUpcomingActivity(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyUpcomingActivity').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
