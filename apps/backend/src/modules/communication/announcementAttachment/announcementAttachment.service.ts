import { db } from '../../../database/custom-prisma-client';

export async function getAllAnnouncementAttachments() {
  return db.announcementAttachment.findMany();
}

export async function getAnnouncementAttachmentById(id: string) {
  return db.announcementAttachment.findUnique({
    where: { id },
  });
}

export async function createAnnouncementAttachment(data: any) {
  return db.announcementAttachment.create({
    data,
  });
}

export async function updateAnnouncementAttachment(id: string, data: any) {
  try {
    return await db.announcementAttachment.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteAnnouncementAttachment(id: string) {
  try {
    await db.announcementAttachment.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
