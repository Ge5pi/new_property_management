import { Request, Response } from 'express';
import * as inspectionService from './inspection.service';
import { z } from 'zod';

const createInspectionSchema = z.object({
  name: z.string(),
  date: z.string().datetime(),
  unitId: z.string().uuid(),
});

const updateInspectionSchema = z.object({
  name: z.string().optional(),
  date: z.string().datetime().optional(),
  unitId: z.string().uuid().optional(),
});

export async function getAllInspections(req: Request, res: Response) {
  try {
    const inspections = await inspectionService.findAllInspections();
    res.json(inspections);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inspections' });
  }
}

export async function createInspection(req: Request, res: Response) {
  try {
    const validatedData = createInspectionSchema.parse(req.body);
    const newInspection = await inspectionService.createInspection(validatedData);
    res.status(201).json(newInspection);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create inspection' });
    }
  }
}

export async function getInspectionById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const inspection = await inspectionService.findInspectionById(id);
    if (inspection) {
      res.json(inspection);
    } else {
      res.status(404).json({ error: 'Inspection not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inspection' });
  }
}

export async function updateInspection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateInspectionSchema.parse(req.body);
    const updatedInspection = await inspectionService.updateInspection(id, validatedData);
    if (updatedInspection) {
      res.json(updatedInspection);
    } else {
      res.status(404).json({ error: 'Inspection not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update inspection' });
    }
  }
}

export async function deleteInspection(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await inspectionService.deleteInspection(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Inspection not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
