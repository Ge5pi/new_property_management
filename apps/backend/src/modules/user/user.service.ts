import { db } from '../../database/custom-prisma-client';

export async function getAllUsers() {
  return db.user.findMany();
}

export async function getUserById(id: string) {
  return db.user.findUnique({
    where: { id },
  });
}

export async function createUser(data: any) {
  return db.user.create({
    data,
  });
}

export async function updateUser(id: string, data: any) {
  try {
    return await db.user.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteUser(id: string) {
  try {
    await db.user.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
