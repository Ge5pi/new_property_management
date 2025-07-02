import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationResidentialHistory } from '../../generated/types';

export async function findAllRentalApplicationResidentialHistories() {
  return await db.$kysely.selectFrom('RentalApplicationResidentialHistory').selectAll().execute();
}

export async function createRentalApplicationResidentialHistory(rentalApplicationResidentialHistoryData: Insertable<RentalApplicationResidentialHistory>) {
  return await db.$kysely.insertInto('RentalApplicationResidentialHistory').values(rentalApplicationResidentialHistoryData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationResidentialHistoryById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationResidentialHistory').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationResidentialHistory(id: string, rentalApplicationResidentialHistoryData: Updateable<RentalApplicationResidentialHistory>) {
  return await db.$kysely.updateTable('RentalApplicationResidentialHistory').set(rentalApplicationResidentialHistoryData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationResidentialHistory(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationResidentialHistory').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
