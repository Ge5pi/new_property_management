import { db } from '../../../database/custom-prisma-client';

export async function getAllNoteAttachments() {
  return db.noteAttachment.findMany();
}

export async function getNoteAttachmentById(id: string) {
  return db.noteAttachment.findUnique({
    where: { id },
  });
}

export async function createNoteAttachment(data: any) {
  return db.noteAttachment.create({
    data,
  });
}

export async function updateNoteAttachment(id: string, data: any) {
  try {
    return await db.noteAttachment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteNoteAttachment(id: string) {
  try {
    await db.noteAttachment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
