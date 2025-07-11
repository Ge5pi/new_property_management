import { Request, Response } from 'express';
import * as emailTemplateService from './emailTemplate.service';

export async function getAllEmailTemplates(req: Request, res: Response): Promise<void> {
  try {
    const emailTemplates = await emailTemplateService.getAllEmailTemplates();
    res.json(emailTemplates);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get email templates' });
  }
}

export async function getEmailTemplateById(req: Request, res: Response): Promise<void> {
  try {
    const emailTemplate = await emailTemplateService.getEmailTemplateById(req.params.id);
    if (!emailTemplate) {
      res.status(404).json({ message: 'Email template not found' });
      return;
    }
    res.json(emailTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get email template' });
  }
}

export async function createEmailTemplate(req: Request, res: Response): Promise<void> {
  try {
    const newEmailTemplate = await emailTemplateService.createEmailTemplate(req.body);
    res.status(201).json(newEmailTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create email template' });
  }
}

export async function updateEmailTemplate(req: Request, res: Response): Promise<void> {
  try {
    const updatedEmailTemplate = await emailTemplateService.updateEmailTemplate(req.params.id, req.body);
    if (!updatedEmailTemplate) {
      res.status(404).json({ message: 'Email template not found' });
      return;
    }
    res.json(updatedEmailTemplate);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update email template' });
  }
}

export async function deleteEmailTemplate(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await emailTemplateService.deleteEmailTemplate(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Email template not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete email template' });
  }
}
