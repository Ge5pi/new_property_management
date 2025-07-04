import { Request, Response } from 'express';
import * as areaItemService from './area_item.service';
import { z } from 'zod';

const createAreaItemSchema = z.object({
  name: z.string(),
  condition: z.enum(['OKAY', 'NOT_OKAY']),
  areaId: z.string().uuid(),
});

const updateAreaItemSchema = z.object({
  name: z.string().optional(),
  condition: z.enum(['OKAY', 'NOT_OKAY']).optional(),
  areaId: z.string().uuid().optional(),
});

export async function getAllAreaItems(req: Request, res: Response) {
  try {
    const areaItems = await areaItemService.findAllAreaItems();
    res.json(areaItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve area items' });
  }
}

export async function createAreaItem(req: Request, res: Response) {
  try {
    const validatedData = createAreaItemSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      name: validatedData.name,
      condition: validatedData.condition,
      area_id: validatedData.areaId,
    };
    const newAreaItem = await areaItemService.createAreaItem(mappedData);
    res.status(201).json(newAreaItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create area item' });
    }
  }
}

export async function getAreaItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const areaItem = await areaItemService.findAreaItemById(id);
    if (areaItem) {
      res.json(areaItem);
    } else {
      res.status(404).json({ error: 'Area item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve area item' });
  }
}

export async function updateAreaItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateAreaItemSchema.parse(req.body);
    const updatedAreaItem = await areaItemService.updateAreaItem(id, validatedData);
    if (updatedAreaItem) {
      res.json(updatedAreaItem);
    } else {
      res.status(404).json({ error: 'Area item not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteAreaItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await areaItemService.deleteAreaItem(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Area item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
