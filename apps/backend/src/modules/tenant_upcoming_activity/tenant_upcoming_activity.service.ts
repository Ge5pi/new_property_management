import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { TenantUpcomingActivity } from '../../generated/types';

export async function findAllTenantUpcomingActivities() {
  return await db.$kysely.selectFrom('TenantUpcomingActivity').selectAll().execute();
}

export async function createTenantUpcomingActivity(tenantUpcomingActivityData: Insertable<TenantUpcomingActivity>) {
  return await db.$kysely.insertInto('TenantUpcomingActivity').values(tenantUpcomingActivityData).returningAll().executeTakeFirstOrThrow();
}

export async function findTenantUpcomingActivityById(id: string) {
  return await db.$kysely.selectFrom('TenantUpcomingActivity').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateTenantUpcomingActivity(id: string, tenantUpcomingActivityData: Updateable<TenantUpcomingActivity>) {
  return await db.$kysely.updateTable('TenantUpcomingActivity').set(tenantUpcomingActivityData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteTenantUpcomingActivity(id: string) {
  const result = await db.$kysely.deleteFrom('TenantUpcomingActivity').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
