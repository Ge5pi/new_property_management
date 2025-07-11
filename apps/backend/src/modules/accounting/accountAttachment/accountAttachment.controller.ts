import { Request, Response } from 'express';
import * as accountAttachmentService from './accountAttachment.service';

export async function getAllAccountAttachments(req: Request, res: Response): Promise<void> {
  try {
    const accountAttachments = await accountAttachmentService.getAllAccountAttachments();
    res.json(accountAttachments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get account attachments' });
  }
}

export async function getAccountAttachmentById(req: Request, res: Response): Promise<void> {
  try {
    const accountAttachment = await accountAttachmentService.getAccountAttachmentById(req.params.id);
    if (!accountAttachment) {
      res.status(404).json({ message: 'Account attachment not found' });
      return;
    }
    res.json(accountAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get account attachment' });
  }
}

export async function createAccountAttachment(req: Request, res: Response): Promise<void> {
  try {
    const newAccountAttachment = await accountAttachmentService.createAccountAttachment(req.body);
    res.status(201).json(newAccountAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create account attachment' });
  }
}

export async function updateAccountAttachment(req: Request, res: Response): Promise<void> {
  try {
    const updatedAccountAttachment = await accountAttachmentService.updateAccountAttachment(req.params.id, req.body);
    if (!updatedAccountAttachment) {
      res.status(404).json({ message: 'Account attachment not found' });
      return;
    }
    res.json(updatedAccountAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update account attachment' });
  }
}

export async function deleteAccountAttachment(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await accountAttachmentService.deleteAccountAttachment(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Account attachment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete account attachment' });
  }
}
