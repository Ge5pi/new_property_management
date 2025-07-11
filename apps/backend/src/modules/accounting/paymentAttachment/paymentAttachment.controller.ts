import { Request, Response } from 'express';
import * as paymentAttachmentService from './paymentAttachment.service';

export async function getAllPaymentAttachments(req: Request, res: Response): Promise<void> {
  try {
    const paymentAttachments = await paymentAttachmentService.getAllPaymentAttachments();
    res.json(paymentAttachments);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get payment attachments' });
  }
}

export async function getPaymentAttachmentById(req: Request, res: Response): Promise<void> {
  try {
    const paymentAttachment = await paymentAttachmentService.getPaymentAttachmentById(req.params.id);
    if (!paymentAttachment) {
      res.status(404).json({ message: 'Payment attachment not found' });
      return;
    }
    res.json(paymentAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get payment attachment' });
  }
}

export async function createPaymentAttachment(req: Request, res: Response): Promise<void> {
  try {
    const newPaymentAttachment = await paymentAttachmentService.createPaymentAttachment(req.body);
    res.status(201).json(newPaymentAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create payment attachment' });
  }
}

export async function updatePaymentAttachment(req: Request, res: Response): Promise<void> {
  try {
    const updatedPaymentAttachment = await paymentAttachmentService.updatePaymentAttachment(req.params.id, req.body);
    if (!updatedPaymentAttachment) {
      res.status(404).json({ message: 'Payment attachment not found' });
      return;
    }
    res.json(updatedPaymentAttachment);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update payment attachment' });
  }
}

export async function deletePaymentAttachment(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await paymentAttachmentService.deletePaymentAttachment(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Payment attachment not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete payment attachment' });
  }
}
