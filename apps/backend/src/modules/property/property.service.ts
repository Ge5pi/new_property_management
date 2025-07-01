import { db } from '../../database';

export async function findAllProperties() {
  return await db.$kysely.selectFrom('Property').selectAll().execute();
}
