import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { ServiceRequestAttachment } from '../../generated/types';

export async function findAllServiceRequestAttachments() {
  return await db.$kysely.selectFrom('ServiceRequestAttachment').selectAll().execute();
}

export async function createServiceRequestAttachment(serviceRequestAttachmentData: Insertable<ServiceRequestAttachment>) {
  return await db.$kysely.insertInto('ServiceRequestAttachment').values(serviceRequestAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findServiceRequestAttachmentById(id: string) {
  return await db.$kysely.selectFrom('ServiceRequestAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateServiceRequestAttachment(id: string, serviceRequestAttachmentData: Updateable<ServiceRequestAttachment>) {
  return await db.$kysely.updateTable('ServiceRequestAttachment').set(serviceRequestAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteServiceRequestAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('ServiceRequestAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
