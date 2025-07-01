import { db } from '../../database';

export async function findAllRentalApplications() {
  return await db.$kysely.selectFrom('RentalApplication').selectAll().execute();
}
