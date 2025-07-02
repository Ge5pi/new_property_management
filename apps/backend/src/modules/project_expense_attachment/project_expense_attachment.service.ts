import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { ProjectExpenseAttachment } from '../../generated/types';

export async function findAllProjectExpenseAttachments() {
  return await db.$kysely.selectFrom('ProjectExpenseAttachment').selectAll().execute();
}

export async function createProjectExpenseAttachment(projectExpenseAttachmentData: Insertable<ProjectExpenseAttachment>) {
  return await db.$kysely.insertInto('ProjectExpenseAttachment').values(projectExpenseAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findProjectExpenseAttachmentById(id: string) {
  return await db.$kysely.selectFrom('ProjectExpenseAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateProjectExpenseAttachment(id: string, projectExpenseAttachmentData: Updateable<ProjectExpenseAttachment>) {
  return await db.$kysely.updateTable('ProjectExpenseAttachment').set(projectExpenseAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteProjectExpenseAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('ProjectExpenseAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
