import { db } from '../../../database/custom-prisma-client';

export async function getAllGeneralLedgerTransactions() {
  return db.generalLedgerTransaction.findMany();
}

export async function getGeneralLedgerTransactionById(id: string) {
  return db.generalLedgerTransaction.findUnique({
    where: { id },
  });
}

export async function createGeneralLedgerTransaction(data: any) {
  return db.generalLedgerTransaction.create({
    data,
  });
}

export async function updateGeneralLedgerTransaction(id: string, data: any) {
  try {
    return await db.generalLedgerTransaction.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteGeneralLedgerTransaction(id: string) {
  try {
    await db.generalLedgerTransaction.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
