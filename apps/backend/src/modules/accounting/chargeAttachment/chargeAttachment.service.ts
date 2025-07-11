import { db } from '../../../database/custom-prisma-client';

export async function getAllChargeAttachments() {
  return db.chargeAttachment.findMany();
}

export async function getChargeAttachmentById(id: string) {
  return db.chargeAttachment.findUnique({
    where: { id },
  });
}

export async function createChargeAttachment(data: any) {
  return db.chargeAttachment.create({
    data,
  });
}

export async function updateChargeAttachment(id: string, data: any) {
  try {
    return await db.chargeAttachment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteChargeAttachment(id: string) {
  try {
    await db.chargeAttachment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
