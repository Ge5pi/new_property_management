import { db } from '../../../database/custom-prisma-client';

export async function getAllAccounts() {
  return db.account.findMany();
}

export async function getAccountById(id: string) {
  return db.account.findUnique({
    where: { id },
  });
}

export async function createAccount(data: any) {
  return db.account.create({
    data,
  });
}

export async function updateAccount(id: string, data: any) {
  try {
    return await db.account.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteAccount(id: string) {
  try {
    await db.account.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
