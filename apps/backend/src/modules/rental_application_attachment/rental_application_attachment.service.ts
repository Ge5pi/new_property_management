import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationAttachment } from '../../generated/types';

export async function findAllRentalApplicationAttachments() {
  return await db.$kysely.selectFrom('RentalApplicationAttachment').selectAll().execute();
}

export async function createRentalApplicationAttachment(rentalApplicationAttachmentData: Insertable<RentalApplicationAttachment>) {
  return await db.$kysely.insertInto('RentalApplicationAttachment').values(rentalApplicationAttachmentData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationAttachmentById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationAttachment').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationAttachment(id: string, rentalApplicationAttachmentData: Updateable<RentalApplicationAttachment>) {
  return await db.$kysely.updateTable('RentalApplicationAttachment').set(rentalApplicationAttachmentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationAttachment(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationAttachment').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
