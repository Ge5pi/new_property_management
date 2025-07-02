import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationTemplate } from '../../generated/types';

export async function findAllRentalApplicationTemplates() {
  return await db.$kysely.selectFrom('RentalApplicationTemplate').selectAll().execute();
}

export async function createRentalApplicationTemplate(rentalApplicationTemplateData: Insertable<RentalApplicationTemplate>) {
  return await db.$kysely.insertInto('RentalApplicationTemplate').values(rentalApplicationTemplateData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationTemplateById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationTemplate').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationTemplate(id: string, rentalApplicationTemplateData: Updateable<RentalApplicationTemplate>) {
  return await db.$kysely.updateTable('RentalApplicationTemplate').set(rentalApplicationTemplateData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationTemplate(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationTemplate').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
