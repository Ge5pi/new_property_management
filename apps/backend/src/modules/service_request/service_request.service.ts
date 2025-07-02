import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { ServiceRequest } from '../../generated/types';

export async function findAllServiceRequests() {
  return await db.$kysely.selectFrom('ServiceRequest').selectAll().execute();
}

export async function createServiceRequest(serviceRequestData: Insertable<ServiceRequest>) {
  return await db.$kysely.insertInto('ServiceRequest').values(serviceRequestData).returningAll().executeTakeFirstOrThrow();
}

export async function findServiceRequestById(id: string) {
  return await db.$kysely.selectFrom('ServiceRequest').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateServiceRequest(id: string, serviceRequestData: Updateable<ServiceRequest>) {
  return await db.$kysely.updateTable('ServiceRequest').set(serviceRequestData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteServiceRequest(id: string) {
  const result = await db.$kysely.deleteFrom('ServiceRequest').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
