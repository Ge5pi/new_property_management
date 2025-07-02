import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { LeaseTemplate } from '../../generated/types';

export async function findAllLeaseTemplates() {
  return await db.$kysely.selectFrom('LeaseTemplate').selectAll().execute();
}

export async function createLeaseTemplate(leaseTemplateData: Insertable<LeaseTemplate>) {
  return await db.$kysely.insertInto('LeaseTemplate').values(leaseTemplateData).returningAll().executeTakeFirstOrThrow();
}

export async function findLeaseTemplateById(id: string) {
  return await db.$kysely.selectFrom('LeaseTemplate').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateLeaseTemplate(id: string, leaseTemplateData: Updateable<LeaseTemplate>) {
  return await db.$kysely.updateTable('LeaseTemplate').set(leaseTemplateData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteLeaseTemplate(id: string) {
  const result = await db.$kysely.deleteFrom('LeaseTemplate').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
