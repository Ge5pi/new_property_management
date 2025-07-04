import { Request, Response } from 'express';
import * as serviceRequestAttachmentService from './service_request_attachment.service';
import { z } from 'zod';

const createServiceRequestAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  serviceRequestId: z.string().uuid(),
});

const updateServiceRequestAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  serviceRequestId: z.string().uuid().optional(),
});

export async function getAllServiceRequestAttachments(req: Request, res: Response) {
  try {
    const serviceRequestAttachments = await serviceRequestAttachmentService.findAllServiceRequestAttachments();
    res.json(serviceRequestAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve service request attachments' });
  }
}

export async function createServiceRequestAttachment(req: Request, res: Response) {
  try {
    const validatedData = createServiceRequestAttachmentSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      service_request_id: validatedData.serviceRequestId,
      name: validatedData.name,
      file: validatedData.file,
    };
    const newServiceRequestAttachment = await serviceRequestAttachmentService.createServiceRequestAttachment(mappedData);
    res.status(201).json(newServiceRequestAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create service request attachment' });
    }
  }
}

export async function getServiceRequestAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const serviceRequestAttachment = await serviceRequestAttachmentService.findServiceRequestAttachmentById(id);
    if (serviceRequestAttachment) {
      res.json(serviceRequestAttachment);
    } else {
      res.status(404).json({ error: 'Service request attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve service request attachment' });
  }
}

export async function updateServiceRequestAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateServiceRequestAttachmentSchema.parse(req.body);
    const updatedServiceRequestAttachment = await serviceRequestAttachmentService.updateServiceRequestAttachment(id, validatedData);
    if (updatedServiceRequestAttachment) {
      res.json(updatedServiceRequestAttachment);
    } else {
      res.status(404).json({ error: 'Service request attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update service request attachment' });
    }
  }
}

export async function deleteServiceRequestAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await serviceRequestAttachmentService.deleteServiceRequestAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Service request attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
