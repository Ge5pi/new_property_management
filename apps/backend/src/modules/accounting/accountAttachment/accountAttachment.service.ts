import { db } from '../../../database/custom-prisma-client';

export async function getAllAccountAttachments() {
  return db.accountAttachment.findMany();
}

export async function getAccountAttachmentById(id: string) {
  return db.accountAttachment.findUnique({
    where: { id },
  });
}

export async function createAccountAttachment(data: any) {
  return db.accountAttachment.create({
    data,
  });
}

export async function updateAccountAttachment(id: string, data: any) {
  try {
    return await db.accountAttachment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteAccountAttachment(id: string) {
  try {
    await db.accountAttachment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
