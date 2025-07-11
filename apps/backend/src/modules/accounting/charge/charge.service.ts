import { db } from '../../../database/custom-prisma-client';

export async function getAllCharges() {
  return db.charge.findMany();
}

export async function getChargeById(id: string) {
  return db.charge.findUnique({
    where: { id },
  });
}

export async function createCharge(data: any) {
  return db.charge.create({
    data,
  });
}

export async function updateCharge(id: string, data: any) {
  try {
    return await db.charge.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteCharge(id: string) {
  try {
    await db.charge.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
