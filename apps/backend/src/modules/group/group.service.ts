import { db } from '../../database/custom-prisma-client';

export async function getAllGroups() {
  return db.group.findMany();
}

export async function getGroupById(id: string) {
  return db.group.findUnique({
    where: { id },
  });
}

export async function createGroup(data: any) {
  return db.group.create({
    data,
  });
}

export async function updateGroup(id: string, data: any) {
  try {
    return await db.group.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteGroup(id: string) {
  try {
    await db.group.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
