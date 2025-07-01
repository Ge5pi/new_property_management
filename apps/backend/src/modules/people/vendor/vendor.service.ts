import { db } from '../../../database';

export async function findAllVendors() {
  return await db.$kysely.selectFrom('Vendor').selectAll().execute();
}
