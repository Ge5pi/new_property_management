import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Property } from '../../../prisma/generated/types';

export async function findAllProperties() {
  return await db.$kysely.selectFrom('Property').selectAll().execute();
}

export async function createProperty(propertyData: Insertable<Property>) {
  // Exclude id and updatedAt from propertyData before inserting
  const { id, updatedAt, ...insertData } = propertyData as any;
  return await db.$kysely.insertInto('Property').values(insertData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyById(id: string) {
  return await db.$kysely.selectFrom('Property').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateProperty(id: string, propertyData: Updateable<Property>) {
  return await db.$kysely.updateTable('Property').set(propertyData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteProperty(id: string) {
  const result = await db.$kysely.deleteFrom('Property').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
