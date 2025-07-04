import { Request, Response } from 'express';
import * as rentalApplicationAttachmentService from './rental_application_attachment.service';
import { z } from 'zod';

const createRentalApplicationAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  rentalApplicationId: z.string().uuid(),
});

const updateRentalApplicationAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  rentalApplicationId: z.string().uuid().optional(),
});

export async function getAllRentalApplicationAttachments(req: Request, res: Response) {
  try {
    const rentalApplicationAttachments = await rentalApplicationAttachmentService.findAllRentalApplicationAttachments();
    res.json(rentalApplicationAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application attachments' });
  }
}

export async function createRentalApplicationAttachment(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationAttachmentSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      rental_application_id: validatedData.rentalApplicationId,
      name: validatedData.name,
      file: validatedData.file,
    };
    const newRentalApplicationAttachment = await rentalApplicationAttachmentService.createRentalApplicationAttachment(mappedData);
    res.status(201).json(newRentalApplicationAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rental application attachment' });
    }
  }
}

export async function getRentalApplicationAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationAttachment = await rentalApplicationAttachmentService.findRentalApplicationAttachmentById(id);
    if (rentalApplicationAttachment) {
      res.json(rentalApplicationAttachment);
    } else {
      res.status(404).json({ error: 'Rental application attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application attachment' });
  }
}

export async function updateRentalApplicationAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationAttachmentSchema.parse(req.body);
    const updatedRentalApplicationAttachment = await rentalApplicationAttachmentService.updateRentalApplicationAttachment(id, validatedData);
    if (updatedRentalApplicationAttachment) {
      res.json(updatedRentalApplicationAttachment);
    } else {
      res.status(404).json({ error: 'Rental application attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rental application attachment' });
    }
  }
}

export async function deleteRentalApplicationAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationAttachmentService.deleteRentalApplicationAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
