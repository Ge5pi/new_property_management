import { db } from '../../../database/custom-prisma-client';

export async function getAllEmailTemplates() {
  return db.emailTemplate.findMany();
}

export async function getEmailTemplateById(id: string) {
  return db.emailTemplate.findUnique({
    where: { id },
  });
}

export async function createEmailTemplate(data: any) {
  return db.emailTemplate.create({
    data,
  });
}

export async function updateEmailTemplate(id: string, data: any) {
  try {
    return await db.emailTemplate.update({
      where: { id },
      data,
    });
  } catch (error) {
    return null;
  }
}

export async function deleteEmailTemplate(id: string) {
  try {
    await db.emailTemplate.delete({
      where: { id },
    });
    return true;
  } catch (error) {
    return false;
  }
}
