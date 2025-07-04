import { Request, Response } from 'express';
import * as areaService from './area.service';
import { z } from 'zod';

const createAreaSchema = z.object({
  name: z.string(),
  inspectionId: z.string().uuid(),
});

const updateAreaSchema = z.object({
  name: z.string().optional(),
  inspectionId: z.string().uuid().optional(),
});

export async function getAllAreas(req: Request, res: Response) {
  try {
    const areas = await areaService.findAllAreas();
    res.json(areas);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve areas' });
  }
}

export async function createArea(req: Request, res: Response) {
  try {
    const validatedData = createAreaSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      name: validatedData.name,
      inspection_id: validatedData.inspectionId,
    };
    const newArea = await areaService.createArea(mappedData);
    res.status(201).json(newArea);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create area' });
    }
  }
}

export async function getAreaById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const area = await areaService.findAreaById(id);
    if (area) {
      res.json(area);
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve area' });
  }
}

export async function updateArea(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateAreaSchema.parse(req.body);
    const updatedArea = await areaService.updateArea(id, validatedData);
    if (updatedArea) {
      res.json(updatedArea);
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteArea(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await areaService.deleteArea(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Area not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
