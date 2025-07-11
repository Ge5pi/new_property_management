import { db } from '../../../database/custom-prisma-client';

export async function getAllPaymentAttachments() {
  return db.paymentAttachment.findMany();
}

export async function getPaymentAttachmentById(id: string) {
  return db.paymentAttachment.findUnique({
    where: { id },
  });
}

export async function createPaymentAttachment(data: any) {
  return db.paymentAttachment.create({
    data,
  });
}

export async function updatePaymentAttachment(id: string, data: any) {
  try {
    return await db.paymentAttachment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deletePaymentAttachment(id: string) {
  try {
    await db.paymentAttachment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
