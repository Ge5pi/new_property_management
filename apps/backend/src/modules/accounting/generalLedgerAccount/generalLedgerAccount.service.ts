import { db } from '../../../database/custom-prisma-client';

export async function getAllGeneralLedgerAccounts() {
  return db.generalLedgerAccount.findMany();
}

export async function getGeneralLedgerAccountById(id: string) {
  return db.generalLedgerAccount.findUnique({
    where: { id },
  });
}

export async function createGeneralLedgerAccount(data: any) {
  return db.generalLedgerAccount.create({
    data,
  });
}

export async function updateGeneralLedgerAccount(id: string, data: any) {
  try {
    return await db.generalLedgerAccount.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteGeneralLedgerAccount(id: string) {
  try {
    await db.generalLedgerAccount.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
