import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { RentalApplicationEmergencyContact } from '../../generated/types';

export async function findAllRentalApplicationEmergencyContacts() {
  return await db.$kysely.selectFrom('RentalApplicationEmergencyContact').selectAll().execute();
}

export async function createRentalApplicationEmergencyContact(rentalApplicationEmergencyContactData: Insertable<RentalApplicationEmergencyContact>) {
  return await db.$kysely.insertInto('RentalApplicationEmergencyContact').values(rentalApplicationEmergencyContactData).returningAll().executeTakeFirstOrThrow();
}

export async function findRentalApplicationEmergencyContactById(id: string) {
  return await db.$kysely.selectFrom('RentalApplicationEmergencyContact').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateRentalApplicationEmergencyContact(id: string, rentalApplicationEmergencyContactData: Updateable<RentalApplicationEmergencyContact>) {
  return await db.$kysely.updateTable('RentalApplicationEmergencyContact').set(rentalApplicationEmergencyContactData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteRentalApplicationEmergencyContact(id: string) {
  const result = await db.$kysely.deleteFrom('RentalApplicationEmergencyContact').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
