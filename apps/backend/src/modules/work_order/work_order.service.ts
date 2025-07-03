import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { WorkOrder } from '../../generated/types';

export async function findAllWorkOrders() {
  return await db.$kysely.selectFrom('WorkOrder').selectAll().execute();
}

export async function createWorkOrder(workOrderData: any) {
  return await db.$kysely.insertInto('WorkOrder').values(workOrderData).returningAll().executeTakeFirstOrThrow();
}

export async function findWorkOrderById(id: string) {
  return await db.$kysely.selectFrom('WorkOrder').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateWorkOrder(id: string, workOrderData: any) {
  return await db.$kysely.updateTable('WorkOrder').set(workOrderData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteWorkOrder(id: string) {
  const result = await db.$kysely.deleteFrom('WorkOrder').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
