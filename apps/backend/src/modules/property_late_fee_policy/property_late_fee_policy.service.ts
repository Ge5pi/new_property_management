import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyLateFeePolicy } from '../../generated/types';

export async function findAllPropertyLateFeePolicies() {
  return await db.$kysely.selectFrom('PropertyLateFeePolicy').selectAll().execute();
}

export async function createPropertyLateFeePolicy(propertyLateFeePolicyData: Insertable<PropertyLateFeePolicy>) {
  return await db.$kysely.insertInto('PropertyLateFeePolicy').values(propertyLateFeePolicyData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyLateFeePolicyById(id: string) {
  return await db.$kysely.selectFrom('PropertyLateFeePolicy').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyLateFeePolicy(id: string, propertyLateFeePolicyData: Updateable<PropertyLateFeePolicy>) {
  return await db.$kysely.updateTable('PropertyLateFeePolicy').set(propertyLateFeePolicyData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyLateFeePolicy(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyLateFeePolicy').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
