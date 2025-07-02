import { Request, Response } from 'express';
import * as tenantAttachmentService from './tenant_attachment.service';
import { z } from 'zod';

const createTenantAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  tenantId: z.string().uuid(),
});

const updateTenantAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  tenantId: z.string().uuid().optional(),
});

export async function getAllTenantAttachments(req: Request, res: Response) {
  try {
    const tenantAttachments = await tenantAttachmentService.findAllTenantAttachments();
    res.json(tenantAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenant attachments' });
  }
}

export async function createTenantAttachment(req: Request, res: Response) {
  try {
    const validatedData = createTenantAttachmentSchema.parse(req.body);
    const newTenantAttachment = await tenantAttachmentService.createTenantAttachment(validatedData);
    res.status(201).json(newTenantAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create tenant attachment' });
    }
  }
}

export async function getTenantAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantAttachment = await tenantAttachmentService.findTenantAttachmentById(id);
    if (tenantAttachment) {
      res.json(tenantAttachment);
    } else {
      res.status(404).json({ error: 'Tenant attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenant attachment' });
  }
}

export async function updateTenantAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateTenantAttachmentSchema.parse(req.body);
    const updatedTenantAttachment = await tenantAttachmentService.updateTenantAttachment(id, validatedData);
    if (updatedTenantAttachment) {
      res.json(updatedTenantAttachment);
    } else {
      res.status(404).json({ error: 'Tenant attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update tenant attachment' });
    }
  }
}

export async function deleteTenantAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await tenantAttachmentService.deleteTenantAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tenant attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
