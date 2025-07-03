import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Inspection } from '../../generated/types';

export async function findAllInspections() {
  return await db.$kysely.selectFrom('Inspection').selectAll().execute();
}

export async function createInspection(inspectionData: any) {
  return await db.$kysely.insertInto('Inspection').values(inspectionData).returningAll().executeTakeFirstOrThrow();
}

export async function findInspectionById(id: string) {
  return await db.$kysely.selectFrom('Inspection').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateInspection(id: string, inspectionData: any) {
  return await db.$kysely.updateTable('Inspection').set(inspectionData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteInspection(id: string) {
  const result = await db.$kysely.deleteFrom('Inspection').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
