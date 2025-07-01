import { db } from '../../database';

export async function findAllUnits() {
  return await db.$kysely.selectFrom('Unit').selectAll().execute();
}
