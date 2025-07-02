import { db } from '../../database';
import bcrypt from 'bcryptjs';
import type { Insertable, Selectable } from 'kysely';

export type User = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
};

export async function registerUser(userData: Insertable<User>): Promise<Selectable<User>> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await db.$kysely.insertInto('User').values({
    ...userData,
    password: hashedPassword,
  }).returningAll().executeTakeFirstOrThrow();
}

export async function loginUser(email: string, password: string): Promise<Selectable<User> | undefined> {
  const user = await db.$kysely.selectFrom('User').selectAll().where('email', '=', email).executeTakeFirst();

  if (!user) {
    return undefined;
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    return undefined;
  }

  return user;
}
