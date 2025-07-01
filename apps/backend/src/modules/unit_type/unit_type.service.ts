import { db } from '../../database';

export async function findAllUnitTypes() {
  return await db.$kysely.selectFrom('UnitType').selectAll().execute();
}
