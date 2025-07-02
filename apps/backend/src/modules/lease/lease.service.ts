import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Lease } from '../../../prisma/generated/types';

export async function findAllLeases() {
  return await db.$kysely.selectFrom('Lease').selectAll().execute();
}

export async function createLease(leaseData: Insertable<Lease>) {
  return await db.$kysely.insertInto('Lease').values(leaseData).returningAll().executeTakeFirstOrThrow();
}

export async function findLeaseById(id: string) {
  return await db.$kysely.selectFrom('Lease').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateLease(id: string, leaseData: Updateable<Lease>) {
  return await db.$kysely.updateTable('Lease').set(leaseData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteLease(id: string) {
  const result = await db.$kysely.deleteFrom('Lease').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
