import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { TenantAttachment } from '../../generated/types';

export async function findAllTenantAttachments() {
  return await db.$kysely.selectFrom('TenantAttachment').selectAll().execute();
}

export async function createTenantAttachment(tenantAttachmentData: Insertable<TenantAttachment>) {
  return await db.$kysely.insertInto('TenantAttachment').values(tenantAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findTenantAttachmentById(id: string) {
  return await db.$kysely.selectFrom('TenantAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateTenantAttachment(id: string, tenantAttachmentData: Updateable<TenantAttachment>) {
  return await db.$kysely.updateTable('TenantAttachment').set(tenantAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteTenantAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('TenantAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
