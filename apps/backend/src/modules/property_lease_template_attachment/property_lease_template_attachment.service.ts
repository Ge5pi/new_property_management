import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyLeaseTemplateAttachment } from '../../generated/types';

export async function findAllPropertyLeaseTemplateAttachments() {
  return await db.$kysely.selectFrom('PropertyLeaseTemplateAttachment').selectAll().execute();
}

export async function createPropertyLeaseTemplateAttachment(propertyLeaseTemplateAttachmentData: Insertable<PropertyLeaseTemplateAttachment>) {
  return await db.$kysely.insertInto('PropertyLeaseTemplateAttachment').values(propertyLeaseTemplateAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyLeaseTemplateAttachmentById(id: string) {
  return await db.$kysely.selectFrom('PropertyLeaseTemplateAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyLeaseTemplateAttachment(id: string, propertyLeaseTemplateAttachmentData: Updateable<PropertyLeaseTemplateAttachment>) {
  return await db.$kysely.updateTable('PropertyLeaseTemplateAttachment').set(propertyLeaseTemplateAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyLeaseTemplateAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyLeaseTemplateAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
