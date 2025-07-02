import { db } from '../database';
import { Insertable, Updateable, Selectable } from 'kysely';
import { User } from '../generated/types';
import bcrypt from 'bcryptjs';

export async function createUser(userData: Insertable<User>): Promise<Selectable<User>> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await db.$kysely.insertInto('User').values({
    ...userData,
    password: hashedPassword,
  }).returningAll().executeTakeFirstOrThrow();
}

export async function findUserById(id: string): Promise<Selectable<User> | undefined> {
  return await db.$kysely.selectFrom('User').selectAll().where('id', '=', id).executeTakeFirst();
}

export async function findUserByEmail(email: string): Promise<Selectable<User> | undefined> {
  return await db.$kysely.selectFrom('User').selectAll().where('email', '=', email).executeTakeFirst();
}

export async function updateUser(id: string, userData: Updateable<User>): Promise<Selectable<User> | undefined> {
  return await db.$kysely.updateTable('User').set(userData).where('id', '=', id).returningAll().executeTakeFirst();
}

export async function updatePassword(id: string, newPassword: string): Promise<Selectable<User> | undefined> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await db.$kysely.updateTable('User').set({ password: hashedPassword }).where('id', '=', id).returningAll().executeTakeFirst();
}
