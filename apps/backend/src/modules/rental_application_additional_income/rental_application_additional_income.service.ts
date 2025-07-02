import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationAdditionalIncome } from '../../generated/types';

export async function findAllRentalApplicationAdditionalIncome() {
  return await db.$kysely.selectFrom('RentalApplicationAdditionalIncome').selectAll().execute();
}

export async function createRentalApplicationAdditionalIncome(rentalApplicationAdditionalIncomeData: Insertable<RentalApplicationAdditionalIncome>) {
  return await db.$kysely.insertInto('RentalApplicationAdditionalIncome').values(rentalApplicationAdditionalIncomeData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationAdditionalIncomeById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationAdditionalIncome').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationAdditionalIncome(id: string, rentalApplicationAdditionalIncomeData: Updateable<RentalApplicationAdditionalIncome>) {
  return await db.$kysely.updateTable('RentalApplicationAdditionalIncome').set(rentalApplicationAdditionalIncomeData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationAdditionalIncome(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationAdditionalIncome').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
