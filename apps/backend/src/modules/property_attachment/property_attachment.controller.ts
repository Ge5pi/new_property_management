import { Request, Response } from 'express';
import * as propertyAttachmentService from './property_attachment.service';
import { z } from 'zod';

const createPropertyAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  parentPropertyId: z.string().uuid(),
});

const updatePropertyAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyAttachments(req: Request, res: Response) {
  try {
    const propertyAttachments = await propertyAttachmentService.findAllPropertyAttachments();
    res.json(propertyAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property attachments' });
  }
}

export async function createPropertyAttachment(req: Request, res: Response) {
  try {
    const validatedData = createPropertyAttachmentSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      parent_property_id: validatedData.parentPropertyId,
      name: validatedData.name,
      file: validatedData.file,
    };
    const newPropertyAttachment = await propertyAttachmentService.createPropertyAttachment(mappedData);
    res.status(201).json(newPropertyAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property attachment' });
    }
  }
}

export async function getPropertyAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyAttachment = await propertyAttachmentService.findPropertyAttachmentById(id);
    if (propertyAttachment) {
      res.json(propertyAttachment);
    } else {
      res.status(404).json({ error: 'Property attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property attachment' });
  }
}

export async function updatePropertyAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyAttachmentSchema.parse(req.body);
    const updatedPropertyAttachment = await propertyAttachmentService.updatePropertyAttachment(id, validatedData);
    if (updatedPropertyAttachment) {
      res.json(updatedPropertyAttachment);
    } else {
      res.status(404).json({ error: 'Property attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property attachment' });
    }
  }
}

export async function deletePropertyAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyAttachmentService.deletePropertyAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
