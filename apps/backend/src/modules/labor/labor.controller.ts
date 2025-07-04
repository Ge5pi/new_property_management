import { Request, Response } from 'express';
import * as laborService from './labor.service';
import { z } from 'zod';

const createLaborSchema = z.object({
  title: z.string(),
  date: z.string().datetime(),
  hours: z.number().int().positive(),
  description: z.string(),
  workOrderId: z.string().uuid(),
});

const updateLaborSchema = z.object({
  title: z.string().optional(),
  date: z.string().datetime().optional(),
  hours: z.number().int().positive().optional(),
  description: z.string().optional(),
  workOrderId: z.string().uuid().optional(),
});

export async function getAllLabors(req: Request, res: Response) {
  try {
    const labors = await laborService.findAllLabors();
    res.json(labors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve labors' });
  }
}

export async function createLabor(req: Request, res: Response) {
  try {
    const validatedData = createLaborSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      description: validatedData.description,
      hours: validatedData.hours,
      date: validatedData.date,
      title: validatedData.title,
      work_order_id: validatedData.workOrderId,
    };
    const newLabor = await laborService.createLabor(mappedData);
    res.status(201).json(newLabor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create labor' });
    }
  }
}

export async function getLaborById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const labor = await laborService.findLaborById(id);
    if (labor) {
      res.json(labor);
    } else {
      res.status(404).json({ error: 'Labor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve labor' });
  }
}

export async function updateLabor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateLaborSchema.parse(req.body);
    const updatedLabor = await laborService.updateLabor(id, validatedData);
    if (updatedLabor) {
      res.json(updatedLabor);
    } else {
      res.status(404).json({ error: 'Labor not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update labor' });
    }
  }
}

export async function deleteLabor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await laborService.deleteLabor(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Labor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
