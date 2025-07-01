import { db } from '../../../database';

export async function findAllTenants() {
  return await db.$kysely.selectFrom('Tenant').selectAll().execute();
}
