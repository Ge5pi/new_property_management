import { db } from '../../database/custom-prisma-client';
import type { Selectable } from 'kysely';

export type Role = {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function getAllRoles(): Promise<Selectable<Role>[]> {
  return await db.$kysely.selectFrom('Role').selectAll().execute();
}

export async function getRoleById(id: string): Promise<Selectable<Role> | undefined> {
  return await db.$kysely.selectFrom('Role').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function createRole(data: Partial<Role>): Promise<Selectable<Role>> {
  return await db.$kysely.insertInto('Role').values(data).returningAll().executeTakeFirstOrThrow();
}

export async function updateRole(id: string, data: Partial<Role>): Promise<Selectable<Role> | undefined> {
  await db.$kysely.updateTable('Role').set(data).where('id', '=', id).execute();
  return getRoleById(id);
}

export async function deleteRole(id: string): Promise<void> {
  await db.$kysely.deleteFrom('Role').where('id', '=', id).execute();
}
