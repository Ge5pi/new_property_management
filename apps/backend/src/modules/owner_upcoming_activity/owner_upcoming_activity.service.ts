import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { OwnerUpcomingActivity } from '../../generated/types';

export async function findAllOwnerUpcomingActivities() {
  return await db.$kysely.selectFrom('OwnerUpcomingActivity').selectAll().execute();
}

export async function createOwnerUpcomingActivity(ownerUpcomingActivityData: Insertable<OwnerUpcomingActivity>) {
  return await db.$kysely.insertInto('OwnerUpcomingActivity').values(ownerUpcomingActivityData).returningAll().executeTakeFirstOrThrow();
}

export async function findOwnerUpcomingActivityById(id: string) {
  return await db.$kysely.selectFrom('OwnerUpcomingActivity').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateOwnerUpcomingActivity(id: string, ownerUpcomingActivityData: Updateable<OwnerUpcomingActivity>) {
  return await db.$kysely.updateTable('OwnerUpcomingActivity').set(ownerUpcomingActivityData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteOwnerUpcomingActivity(id: string) {
  const result = await db.$kysely.deleteFrom('OwnerUpcomingActivity').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
