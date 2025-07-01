import { db } from '../../database';

export async function findAllLeases() {
  return await db.$kysely.selectFrom('Lease').selectAll().execute();
}
