import { Request, Response } from 'express';
import * as emailSignatureService from './emailSignature.service';

export async function getAllEmailSignatures(req: Request, res: Response): Promise<void> {
  try {
    const emailSignatures = await emailSignatureService.getAllEmailSignatures();
    res.json(emailSignatures);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get email signatures' });
  }
}

export async function getEmailSignatureById(req: Request, res: Response): Promise<void> {
  try {
    const emailSignature = await emailSignatureService.getEmailSignatureById(req.params.id);
    if (!emailSignature) {
      res.status(404).json({ message: 'Email signature not found' });
      return;
    }
    res.json(emailSignature);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get email signature' });
  }
}

export async function createEmailSignature(req: Request, res: Response): Promise<void> {
  try {
    const newEmailSignature = await emailSignatureService.createEmailSignature(req.body);
    res.status(201).json(newEmailSignature);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create email signature' });
  }
}

export async function updateEmailSignature(req: Request, res: Response): Promise<void> {
  try {
    const updatedEmailSignature = await emailSignatureService.updateEmailSignature(req.params.id, req.body);
    if (!updatedEmailSignature) {
      res.status(404).json({ message: 'Email signature not found' });
      return;
    }
    res.json(updatedEmailSignature);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update email signature' });
  }
}

export async function deleteEmailSignature(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await emailSignatureService.deleteEmailSignature(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Email signature not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete email signature' });
  }
}
