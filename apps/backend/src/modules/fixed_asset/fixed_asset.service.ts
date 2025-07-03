import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { FixedAsset } from '../../generated/types';

export async function findAllFixedAssets() {
  return await db.$kysely.selectFrom('FixedAsset').selectAll().execute();
}

export async function createFixedAsset(fixedAssetData: any) {
  return await db.$kysely.insertInto('FixedAsset').values(fixedAssetData).returningAll().executeTakeFirstOrThrow();
}

export async function findFixedAssetById(id: string) {
  return await db.$kysely.selectFrom('FixedAsset').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateFixedAsset(id: string, fixedAssetData: any) {
  return await db.$kysely.updateTable('FixedAsset').set(fixedAssetData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteFixedAsset(id: string) {
  const result = await db.$kysely.deleteFrom('FixedAsset').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
