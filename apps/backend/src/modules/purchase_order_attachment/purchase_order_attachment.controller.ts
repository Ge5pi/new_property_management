import { Request, Response } from 'express';
import * as purchaseOrderAttachmentService from './purchase_order_attachment.service';
import { z } from 'zod';

const createPurchaseOrderAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  purchaseOrderId: z.string().uuid(),
});

const updatePurchaseOrderAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  purchaseOrderId: z.string().uuid().optional(),
});

export async function getAllPurchaseOrderAttachments(req: Request, res: Response) {
  try {
    const purchaseOrderAttachments = await purchaseOrderAttachmentService.findAllPurchaseOrderAttachments();
    res.json(purchaseOrderAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchase order attachments' });
  }
}

export async function createPurchaseOrderAttachment(req: Request, res: Response) {
  try {
    const validatedData = createPurchaseOrderAttachmentSchema.parse(req.body);
    const newPurchaseOrderAttachment = await purchaseOrderAttachmentService.createPurchaseOrderAttachment(validatedData);
    res.status(201).json(newPurchaseOrderAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create purchase order attachment' });
    }
  }
}

export async function getPurchaseOrderAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const purchaseOrderAttachment = await purchaseOrderAttachmentService.findPurchaseOrderAttachmentById(id);
    if (purchaseOrderAttachment) {
      res.json(purchaseOrderAttachment);
    } else {
      res.status(404).json({ error: 'Purchase order attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchase order attachment' });
  }
}

export async function updatePurchaseOrderAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePurchaseOrderAttachmentSchema.parse(req.body);
    const updatedPurchaseOrderAttachment = await purchaseOrderAttachmentService.updatePurchaseOrderAttachment(id, validatedData);
    if (updatedPurchaseOrderAttachment) {
      res.json(updatedPurchaseOrderAttachment);
    } else {
      res.status(404).json({ error: 'Purchase order attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deletePurchaseOrderAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await purchaseOrderAttachmentService.deletePurchaseOrderAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Purchase order attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
