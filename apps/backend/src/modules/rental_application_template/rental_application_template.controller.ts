import { Request, Response } from 'express';
import * as rentalApplicationTemplateService from './rental_application_template.service';
import { z } from 'zod';

const createRentalApplicationTemplateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  generalInfo: z.boolean().default(true),
  personalDetails: z.boolean().default(true),
  rentalHistory: z.boolean().default(true),
  financialInfo: z.boolean().default(true),
  dependentsInfo: z.boolean().default(true),
  otherInfo: z.boolean().default(true),
});

const updateRentalApplicationTemplateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  generalInfo: z.boolean().optional(),
  personalDetails: z.boolean().optional(),
  rentalHistory: z.boolean().optional(),
  financialInfo: z.boolean().optional(),
  dependentsInfo: z.boolean().optional(),
  otherInfo: z.boolean().optional(),
});

export async function getAllRentalApplicationTemplates(req: Request, res: Response) {
  try {
    const rentalApplicationTemplates = await rentalApplicationTemplateService.findAllRentalApplicationTemplates();
    res.json(rentalApplicationTemplates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application templates' });
  }
}

export async function createRentalApplicationTemplate(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationTemplateSchema.parse(req.body);
    const newRentalApplicationTemplate = await rentalApplicationTemplateService.createRentalApplicationTemplate(validatedData);
    res.status(201).json(newRentalApplicationTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rental application template' });
    }
  }
}

export async function getRentalApplicationTemplateById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationTemplate = await rentalApplicationTemplateService.findRentalApplicationTemplateById(id);
    if (rentalApplicationTemplate) {
      res.json(rentalApplicationTemplate);
    } else {
      res.status(404).json({ error: 'Rental application template not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application template' });
  }
}

export async function updateRentalApplicationTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationTemplateSchema.parse(req.body);
    const updatedRentalApplicationTemplate = await rentalApplicationTemplateService.updateRentalApplicationTemplate(id, validatedData);
    if (updatedRentalApplicationTemplate) {
      res.json(updatedRentalApplicationTemplate);
    } else {
      res.status(404).json({ error: 'Rental application template not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rental application template' });
    }
  }
}

export async function deleteRentalApplicationTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationTemplateService.deleteRentalApplicationTemplate(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application template not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
