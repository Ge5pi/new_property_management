import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { ProjectExpense } from '../../generated/types';

export async function findAllProjectExpenses() {
  return await db.$kysely.selectFrom('ProjectExpense').selectAll().execute();
}

export async function createProjectExpense(projectExpenseData: Insertable<ProjectExpense>) {
  return await db.$kysely.insertInto('ProjectExpense').values(projectExpenseData).returningAll().executeTakeFirstOrThrow();
}

export async function findProjectExpenseById(id: string) {
  return await db.$kysely.selectFrom('ProjectExpense').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateProjectExpense(id: string, projectExpenseData: Updateable<ProjectExpense>) {
  return await db.$kysely.updateTable('ProjectExpense').set(projectExpenseData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteProjectExpense(id: string) {
  const result = await db.$kysely.deleteFrom('ProjectExpense').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
