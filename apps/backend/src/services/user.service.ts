import { db } from '../database';
import bcrypt from 'bcryptjs';

export async function createUser(userData: any): Promise<any> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  return await db.tenant.create({
    data: {
      ...userData,
      password: hashedPassword,
    },
  });
}

export async function findUserById(id: string): Promise<any | null> {
  return await db.tenant.findUnique({
    where: { id },
    select: {
      id: true,
      email: true,
      first_name: true,
      last_name: true,
      lease_id: true,
      phone_number: true,
      createdAt: true,
      updatedAt: true,
      user_id: true,
    },
  });
}

export async function findUserByIdWithPassword(id: string): Promise<any | null> {
  return await db.tenant.findUnique({
    where: { id },
  });
}

export async function findUserByEmail(email: string): Promise<any | null> {
  return await db.tenant.findUnique({
    where: { email },
  });
}

export async function updateUser(id: string, userData: any): Promise<any | null> {
  return await db.tenant.update({
    where: { id },
    data: userData,
  });
}

export async function updatePassword(id: string, newPassword: string): Promise<any | null> {
  const hashedPassword = await bcrypt.hash(newPassword, 10);
  return await db.tenant.update({
    where: { id },
    data: { password: hashedPassword },
  });
}
