import { db } from '../../../database/custom-prisma-client';

export async function getAllEmailSignatures() {
  return db.emailSignature.findMany();
}

export async function getEmailSignatureById(id: string) {
  return db.emailSignature.findUnique({
    where: { id },
  });
}

export async function createEmailSignature(data: any) {
  return db.emailSignature.create({
    data,
  });
}

export async function updateEmailSignature(id: string, data: any) {
  try {
    return await db.emailSignature.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteEmailSignature(id: string) {
  try {
    await db.emailSignature.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
