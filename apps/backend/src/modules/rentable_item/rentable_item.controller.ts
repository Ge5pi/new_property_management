import { Request, Response } from 'express';
import * as rentableItemService from './rentable_item.service';
import { z } from 'zod';

const createRentableItemSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  amount: z.number().positive(),
  glAccount: z.string(),
  tenantId: z.string().uuid(),
  status: z.boolean().default(false),
  parentPropertyId: z.string().uuid(),
});

const updateRentableItemSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  glAccount: z.string().optional(),
  tenantId: z.string().uuid().optional(),
  status: z.boolean().optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllRentableItems(req: Request, res: Response) {
  try {
    const rentableItems = await rentableItemService.findAllRentableItems();
    res.json(rentableItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rentable items' });
  }
}

export async function createRentableItem(req: Request, res: Response) {
  try {
    const validatedData = createRentableItemSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      parent_property_id: validatedData.parentPropertyId,
      name: validatedData.name,
      status: validatedData.status,
      tenant_id: validatedData.tenantId,
      amount: validatedData.amount,
      gl_account: validatedData.glAccount,
      description: validatedData.description,
    };
    const newRentableItem = await rentableItemService.createRentableItem(mappedData);
    res.status(201).json(newRentableItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rentable item' });
    }
  }
}

export async function getRentableItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentableItem = await rentableItemService.findRentableItemById(id);
    if (rentableItem) {
      res.json(rentableItem);
    } else {
      res.status(404).json({ error: 'Rentable item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rentable item' });
  }
}

export async function updateRentableItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentableItemSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      name: validatedData.name,
      status: validatedData.status,
      tenant_id: validatedData.tenantId,
      amount: validatedData.amount,
      gl_account: validatedData.glAccount,
      description: validatedData.description,
      parent_property_id: validatedData.parentPropertyId,
    };
    const updatedRentableItem = await rentableItemService.updateRentableItem(id, mappedData);
    if (updatedRentableItem) {
      res.json(updatedRentableItem);
    } else {
      res.status(404).json({ error: 'Rentable item not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rentable item' });
    }
  }
}

export async function deleteRentableItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentableItemService.deleteRentableItem(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rentable item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
