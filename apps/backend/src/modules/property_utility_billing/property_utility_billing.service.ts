import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { PropertyUtilityBilling } from '../../generated/types';

export async function findAllPropertyUtilityBillings() {
  return await db.$kysely.selectFrom('PropertyUtilityBilling').selectAll().execute();
}

export async function createPropertyUtilityBilling(propertyUtilityBillingData: Insertable<PropertyUtilityBilling>) {
  return await db.$kysely.insertInto('PropertyUtilityBilling').values(propertyUtilityBillingData).returningAll().executeTakeFirstOrThrow();
}

export async function findPropertyUtilityBillingById(id: string) {
  return await db.$kysely.selectFrom('PropertyUtilityBilling').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updatePropertyUtilityBilling(id: string, propertyUtilityBillingData: Updateable<PropertyUtilityBilling>) {
  return await db.$kysely.updateTable('PropertyUtilityBilling').set(propertyUtilityBillingData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deletePropertyUtilityBilling(id: string) {
  const result = await db.$kysely.deleteFrom('PropertyUtilityBilling').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
