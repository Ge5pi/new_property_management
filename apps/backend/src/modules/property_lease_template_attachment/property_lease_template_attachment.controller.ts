import { Request, Response } from 'express';
import * as propertyLeaseTemplateAttachmentService from './property_lease_template_attachment.service';
import { z } from 'zod';

const createPropertyLeaseTemplateAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  parentPropertyId: z.string().uuid(),
});

const updatePropertyLeaseTemplateAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyLeaseTemplateAttachments(req: Request, res: Response) {
  try {
    const propertyLeaseTemplateAttachments = await propertyLeaseTemplateAttachmentService.findAllPropertyLeaseTemplateAttachments();
    res.json(propertyLeaseTemplateAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property lease template attachments' });
  }
}

export async function createPropertyLeaseTemplateAttachment(req: Request, res: Response) {
  try {
    const validatedData = createPropertyLeaseTemplateAttachmentSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      parent_property_id: validatedData.parentPropertyId,
      name: validatedData.name,
      file: validatedData.file,
    };
    const newPropertyLeaseTemplateAttachment = await propertyLeaseTemplateAttachmentService.createPropertyLeaseTemplateAttachment(mappedData);
    res.status(201).json(newPropertyLeaseTemplateAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property lease template attachment' });
    }
  }
}

export async function getPropertyLeaseTemplateAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyLeaseTemplateAttachment = await propertyLeaseTemplateAttachmentService.findPropertyLeaseTemplateAttachmentById(id);
    if (propertyLeaseTemplateAttachment) {
      res.json(propertyLeaseTemplateAttachment);
    } else {
      res.status(404).json({ error: 'Property lease template attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property lease template attachment' });
  }
}

export async function updatePropertyLeaseTemplateAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyLeaseTemplateAttachmentSchema.parse(req.body);
    const updatedPropertyLeaseTemplateAttachment = await propertyLeaseTemplateAttachmentService.updatePropertyLeaseTemplateAttachment(id, validatedData);
    if (updatedPropertyLeaseTemplateAttachment) {
      res.json(updatedPropertyLeaseTemplateAttachment);
    } else {
      res.status(404).json({ error: 'Property lease template attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property lease template attachment' });
    }
  }
}

export async function deletePropertyLeaseTemplateAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyLeaseTemplateAttachmentService.deletePropertyLeaseTemplateAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property lease template attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
