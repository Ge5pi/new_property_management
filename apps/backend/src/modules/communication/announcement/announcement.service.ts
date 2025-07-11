import { db } from '../../../database/custom-prisma-client';

export async function getAllAnnouncements() {
  return db.announcement.findMany();
}

export async function getAnnouncementById(id: string) {
  return db.announcement.findUnique({
    where: { id },
  });
}

export async function createAnnouncement(data: any) {
  return db.announcement.create({
    data,
  });
}

export async function updateAnnouncement(id: string, data: any) {
  try {
    return await db.announcement.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteAnnouncement(id: string) {
  try {
    await db.announcement.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
