import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationFinancialInformation } from '../../generated/types';

export async function findAllRentalApplicationFinancialInformation() {
  return await db.$kysely.selectFrom('RentalApplicationFinancialInformation').selectAll().execute();
}

export async function createRentalApplicationFinancialInformation(rentalApplicationFinancialInformationData: Insertable<RentalApplicationFinancialInformation>) {
  return await db.$kysely.insertInto('RentalApplicationFinancialInformation').values(rentalApplicationFinancialInformationData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationFinancialInformationById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationFinancialInformation').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationFinancialInformation(id: string, rentalApplicationFinancialInformationData: Updateable<RentalApplicationFinancialInformation>) {
  return await db.$kysely.updateTable('RentalApplicationFinancialInformation').set(rentalApplicationFinancialInformationData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationFinancialInformation(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationFinancialInformation').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
