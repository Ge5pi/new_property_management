import { Request, Response } from 'express';
import * as emailService from './email.service';

export async function getAllEmails(req: Request, res: Response): Promise<void> {
  try {
    const emails = await emailService.getAllEmails();
    res.json(emails);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get emails' });
  }
}

export async function getEmailById(req: Request, res: Response): Promise<void> {
  try {
    const email = await emailService.getEmailById(req.params.id);
    if (!email) {
      res.status(404).json({ message: 'Email not found' });
      return;
    }
    res.json(email);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get email' });
  }
}

export async function createEmail(req: Request, res: Response): Promise<void> {
  try {
    const newEmail = await emailService.createEmail(req.body);
    res.status(201).json(newEmail);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create email' });
  }
}

export async function updateEmail(req: Request, res: Response): Promise<void> {
  try {
    const updatedEmail = await emailService.updateEmail(req.params.id, req.body);
    if (!updatedEmail) {
      res.status(404).json({ message: 'Email not found' });
      return;
    }
    res.json(updatedEmail);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update email' });
  }
}

export async function deleteEmail(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await emailService.deleteEmail(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Email not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete email' });
  }
}
