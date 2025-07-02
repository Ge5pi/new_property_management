import { db } from '../../../database';
import { Insertable, Updateable } from 'kysely';
import { Tenant } from '../../../generated/types';

export async function findAllTenants() {
  return await db.$kysely.selectFrom('Tenant').selectAll().execute();
}

export async function createTenant(tenantData: Insertable<Tenant>) {
  return await db.$kysely.insertInto('Tenant').values(tenantData).returningAll().executeTakeFirstOrThrow();
}

export async function findTenantById(id: string) {
  return await db.$kysely.selectFrom('Tenant').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateTenant(id: string, tenantData: Updateable<Tenant>) {
  return await db.$kysely.updateTable('Tenant').set(tenantData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteTenant(id: string) {
  const result = await db.$kysely.deleteFrom('Tenant').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
