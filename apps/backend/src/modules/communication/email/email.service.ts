import { db } from '../../../database/custom-prisma-client';

export async function getAllEmails() {
  return db.email.findMany();
}

export async function getEmailById(id: string) {
  return db.email.findUnique({
    where: { id },
  });
}

export async function createEmail(data: any) {
  return db.email.create({
    data,
  });
}

export async function updateEmail(id: string, data: any) {
  try {
    return await db.email.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteEmail(id: string) {
  try {
    await db.email.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
