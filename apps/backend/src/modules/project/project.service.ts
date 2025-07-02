import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Project } from '../../generated/types';

export async function findAllProjects() {
  return await db.$kysely.selectFrom('Project').selectAll().execute();
}

export async function createProject(projectData: Insertable<Project>) {
  return await db.$kysely.insertInto('Project').values(projectData).returningAll().executeTakeFirstOrThrow();
}

export async function findProjectById(id: string) {
  return await db.$kysely.selectFrom('Project').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateProject(id: string, projectData: Updateable<Project>) {
  return await db.$kysely.updateTable('Project').set(projectData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteProject(id: string) {
  const result = await db.$kysely.deleteFrom('Project').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
