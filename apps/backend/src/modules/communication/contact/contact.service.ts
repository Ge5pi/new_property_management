import { db } from '../../../database/custom-prisma-client';

export async function getAllContacts() {
  return db.contact.findMany();
}

export async function getContactById(id: string) {
  return db.contact.findUnique({
    where: { id },
  });
}

export async function createContact(data: any) {
  return db.contact.create({
    data,
  });
}

export async function updateContact(id: string, data: any) {
  try {
    return await db.contact.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteContact(id: string) {
  try {
    await db.contact.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
