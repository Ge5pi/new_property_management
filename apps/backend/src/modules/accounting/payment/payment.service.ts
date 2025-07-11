import { db } from '../../../database/custom-prisma-client';

export async function getAllPayments() {
  return db.payment.findMany();
}

export async function getPaymentById(id: string) {
  return db.payment.findUnique({
    where: { id },
  });
}

export async function createPayment(data: any) {
  return db.payment.create({
    data,
  });
}

export async function updatePayment(id: string, data: any) {
  try {
    return await db.payment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deletePayment(id: string) {
  try {
    await db.payment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
