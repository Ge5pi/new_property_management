import { db } from '../../../database';

export async function findAllOwners() {
  return await db.$kysely.selectFrom('Owner').selectAll().execute();
}
