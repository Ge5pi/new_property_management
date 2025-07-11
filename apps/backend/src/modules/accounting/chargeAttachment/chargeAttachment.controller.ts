import { Request, Response } from 'express';
import * as chargeAttachmentService from './chargeAttachment.service';

export async function getAllChargeAttachments(req: Request, res: Response): Promise<void> {
  try {
    const chargeAttachments = await chargeAttachmentService.getAllChargeAttachments();
    res.json(chargeAttachments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get charge attachments' });
  }
}

export async function getChargeAttachmentById(req: Request, res: Response): Promise<void> {
  try {
    const chargeAttachment = await chargeAttachmentService.getChargeAttachmentById(req.params.id);
    if (!chargeAttachment) {
      res.status(404).json({ message: 'Charge attachment not found' });
      return;
    }
    res.json(chargeAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get charge attachment' });
  }
}

export async function createChargeAttachment(req: Request, res: Response): Promise<void> {
  try {
    const newChargeAttachment = await chargeAttachmentService.createChargeAttachment(req.body);
    res.status(201).json(newChargeAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create charge attachment' });
  }
}

export async function updateChargeAttachment(req: Request, res: Response): Promise<void> {
  try {
    const updatedChargeAttachment = await chargeAttachmentService.updateChargeAttachment(req.params.id, req.body);
    if (!updatedChargeAttachment) {
      res.status(404).json({ message: 'Charge attachment not found' });
      return;
    }
    res.json(updatedChargeAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update charge attachment' });
  }
}

export async function deleteChargeAttachment(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await chargeAttachmentService.deleteChargeAttachment(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Charge attachment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete charge attachment' });
  }
}
