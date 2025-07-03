import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplication } from '../../generated/types';

export async function findAllRentalApplications() {
  return await db.$kysely.selectFrom('RentalApplication').selectAll().execute();
}

export async function createRentalApplication(rentalApplicationData: any) {
  return await db.$kysely.insertInto('RentalApplication').values(rentalApplicationData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationById(id: string) {
  return await db.$kysely.selectFrom('RentalApplication').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplication(id: string, rentalApplicationData: Updateable<RentalApplication>) {
  return await db.$kysely.updateTable('RentalApplication').set(rentalApplicationData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplication(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplication').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
