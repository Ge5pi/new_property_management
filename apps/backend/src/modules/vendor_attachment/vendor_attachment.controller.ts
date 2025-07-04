import { Request, Response } from 'express';
import * as vendorAttachmentService from './vendor_attachment.service';
import { z } from 'zod';

const createVendorAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  vendorId: z.string().uuid(),
});

const updateVendorAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  vendorId: z.string().uuid().optional(),
});

export async function getAllVendorAttachments(req: Request, res: Response) {
  try {
    const vendorAttachments = await vendorAttachmentService.findAllVendorAttachments();
    res.json(vendorAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor attachments' });
  }
}

export async function createVendorAttachment(req: Request, res: Response) {
  try {
    const validatedData = createVendorAttachmentSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      vendor_id: validatedData.vendorId,
      name: validatedData.name,
      file: validatedData.file,
    };
    const newVendorAttachment = await vendorAttachmentService.createVendorAttachment(mappedData);
    res.status(201).json(newVendorAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create vendor attachment' });
    }
  }
}

export async function getVendorAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const vendorAttachment = await vendorAttachmentService.findVendorAttachmentById(id);
    if (vendorAttachment) {
      res.json(vendorAttachment);
    } else {
      res.status(404).json({ error: 'Vendor attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor attachment' });
  }
}

export async function updateVendorAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateVendorAttachmentSchema.parse(req.body);
    const updatedVendorAttachment = await vendorAttachmentService.updateVendorAttachment(id, validatedData);
    if (updatedVendorAttachment) {
      res.json(updatedVendorAttachment);
    } else {
      res.status(404).json({ error: 'Vendor attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update vendor attachment' });
    }
  }
}

export async function deleteVendorAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await vendorAttachmentService.deleteVendorAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Vendor attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
