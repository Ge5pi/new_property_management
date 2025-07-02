import { db } from '../../database';
import { Insertable, Updateable } from 'kysely';
import { Applicant } from '../../../prisma/generated/types';

export async function findAllApplicants() {
  return await db.$kysely.selectFrom('Applicant').selectAll().execute();
}

export async function createApplicant(applicantData: Insertable<Applicant>) {
  return await db.$kysely.insertInto('Applicant').values(applicantData).returningAll().executeTakeFirstOrThrow();
}

export async function findApplicantById(id: string) {
  return await db.$kysely.selectFrom('Applicant').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function updateApplicant(id: string, applicantData: Updateable<Applicant>) {
  return await db.$kysely.updateTable('Applicant').set(applicantData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function deleteApplicant(id: string) {
  const result = await db.$kysely.deleteFrom('Applicant').where('id', '=', id).executeTakeFirst();
  return result !== undefined && result.numDeletedRows > 0;
}
