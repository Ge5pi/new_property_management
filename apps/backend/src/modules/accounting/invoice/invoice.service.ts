import { db } from '../../../database/custom-prisma-client';

export async function getAllInvoices() {
  return db.invoice.findMany();
}

export async function getInvoiceById(id: string) {
  return db.invoice.findUnique({
    where: { id },
  });
}

export async function createInvoice(data: any) {
  return db.invoice.create({
    data,
  });
}

export async function updateInvoice(id: string, data: any) {
  try {
    return await db.invoice.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteInvoice(id: string) {
  try {
    await db.invoice.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
