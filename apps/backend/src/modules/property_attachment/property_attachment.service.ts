import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyAttachment } from '../../generated/types';

export async function findAllPropertyAttachments() {
  return await db.$kysely.selectFrom('PropertyAttachment').selectAll().execute();
}

export async function createPropertyAttachment(propertyAttachmentData: Insertable<PropertyAttachment>) {
  return await db.$kysely.insertInto('PropertyAttachment').values(propertyAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyAttachmentById(id: string) {
  return await db.$kysely.selectFrom('PropertyAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyAttachment(id: string, propertyAttachmentData: Updateable<PropertyAttachment>) {
  return await db.$kysely.updateTable('PropertyAttachment').set(propertyAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
