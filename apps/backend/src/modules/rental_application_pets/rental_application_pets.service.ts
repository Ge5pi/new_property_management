import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationPets } from '../../generated/types';

export async function findAllRentalApplicationPets() {
  return await db.$kysely.selectFrom('RentalApplicationPets').selectAll().execute();
}

export async function createRentalApplicationPets(rentalApplicationPetsData: Insertable<RentalApplicationPets>) {
  return await db.$kysely.insertInto('RentalApplicationPets').values(rentalApplicationPetsData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationPetsById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationPets').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationPets(id: string, rentalApplicationPetsData: Updateable<RentalApplicationPets>) {
  return await db.$kysely.updateTable('RentalApplicationPets').set(rentalApplicationPetsData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationPets(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationPets').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
