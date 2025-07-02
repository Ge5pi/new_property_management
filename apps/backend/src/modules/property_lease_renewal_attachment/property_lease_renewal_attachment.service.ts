import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyLeaseRenewalAttachment } from '../../generated/types';

export async function findAllPropertyLeaseRenewalAttachments() {
  return await db.$kysely.selectFrom('PropertyLeaseRenewalAttachment').selectAll().execute();
}

export async function createPropertyLeaseRenewalAttachment(propertyLeaseRenewalAttachmentData: Insertable<PropertyLeaseRenewalAttachment>) {
  return await db.$kysely.insertInto('PropertyLeaseRenewalAttachment').values(propertyLeaseRenewalAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyLeaseRenewalAttachmentById(id: string) {
  return await db.$kysely.selectFrom('PropertyLeaseRenewalAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyLeaseRenewalAttachment(id: string, propertyLeaseRenewalAttachmentData: Updateable<PropertyLeaseRenewalAttachment>) {
  return await db.$kysely.updateTable('PropertyLeaseRenewalAttachment').set(propertyLeaseRenewalAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyLeaseRenewalAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyLeaseRenewalAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
