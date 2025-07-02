import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationDependent } from '../../generated/types';

export async function findAllRentalApplicationDependents() {
  return await db.$kysely.selectFrom('RentalApplicationDependent').selectAll().execute();
}

export async function createRentalApplicationDependent(rentalApplicationDependentData: Insertable<RentalApplicationDependent>) {
  return await db.$kysely.insertInto('RentalApplicationDependent').values(rentalApplicationDependentData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationDependentById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationDependent').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationDependent(id: string, rentalApplicationDependentData: Updateable<RentalApplicationDependent>) {
  return await db.$kysely.updateTable('RentalApplicationDependent').set(rentalApplicationDependentData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationDependent(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationDependent').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
