import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { SecondaryTenant } from '../../generated/types';

export async function findAllSecondaryTenants() {
  return await db.$kysely.selectFrom('SecondaryTenant').selectAll().execute();
}

export async function createSecondaryTenant(secondaryTenantData: Insertable<SecondaryTenant>) {
  return await db.$kysely.insertInto('SecondaryTenant').values(secondaryTenantData).returningAll().executeTakeFirstOrThrow();
}

export async function findSecondaryTenantById(id: string) {
  return await db.$kysely.selectFrom('SecondaryTenant').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateSecondaryTenant(id: string, secondaryTenantData: Updateable<SecondaryTenant>) {
  return await db.$kysely.updateTable('SecondaryTenant').set(secondaryTenantData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteSecondaryTenant(id: string) {
  const result = await db.$kysely.deleteFrom('SecondaryTenant').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
