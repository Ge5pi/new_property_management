import { db } from '../../../database/custom-prisma-client';

export async function getAllNotes() {
  return db.note.findMany();
}

export async function getNoteById(id: string) {
  return db.note.findUnique({
    where: { id },
  });
}

export async function createNote(data: any) {
  return db.note.create({
    data,
  });
}

export async function updateNote(id: string, data: any) {
  try {
    return await db.note.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteNote(id: string) {
  try {
    await db.note.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
