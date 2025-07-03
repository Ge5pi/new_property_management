import { Request, Response } from 'express';
import * as propertyLeaseRenewalAttachmentService from './property_lease_renewal_attachment.service';
import { z } from 'zod';

const createPropertyLeaseRenewalAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  parentPropertyId: z.string().uuid(),
});

const updatePropertyLeaseRenewalAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyLeaseRenewalAttachments(req: Request, res: Response) {
  try {
    const propertyLeaseRenewalAttachments = await propertyLeaseRenewalAttachmentService.findAllPropertyLeaseRenewalAttachments();
    res.json(propertyLeaseRenewalAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property lease renewal attachments' });
  }
}

export async function createPropertyLeaseRenewalAttachment(req: Request, res: Response) {
  try {
    const validatedData = createPropertyLeaseRenewalAttachmentSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      parent_property_id: validatedData.parentPropertyId,
      name: validatedData.name,
      file: validatedData.file,
    };
    const newPropertyLeaseRenewalAttachment = await propertyLeaseRenewalAttachmentService.createPropertyLeaseRenewalAttachment(mappedData);
    res.status(201).json(newPropertyLeaseRenewalAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property lease renewal attachment' });
    }
  }
}

export async function getPropertyLeaseRenewalAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyLeaseRenewalAttachment = await propertyLeaseRenewalAttachmentService.findPropertyLeaseRenewalAttachmentById(id);
    if (propertyLeaseRenewalAttachment) {
      res.json(propertyLeaseRenewalAttachment);
    } else {
      res.status(404).json({ error: 'Property lease renewal attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property lease renewal attachment' });
  }
}

export async function updatePropertyLeaseRenewalAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyLeaseRenewalAttachmentSchema.parse(req.body);
    const updatedPropertyLeaseRenewalAttachment = await propertyLeaseRenewalAttachmentService.updatePropertyLeaseRenewalAttachment(id, validatedData);
    if (updatedPropertyLeaseRenewalAttachment) {
      res.json(updatedPropertyLeaseRenewalAttachment);
    } else {
      res.status(404).json({ error: 'Property lease renewal attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property lease renewal attachment' });
    }
  }
}

export async function deletePropertyLeaseRenewalAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyLeaseRenewalAttachmentService.deletePropertyLeaseRenewalAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property lease renewal attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
