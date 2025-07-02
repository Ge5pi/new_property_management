import { Request, Response } from 'express';
import * as inventoryService from './inventory.service';
import { z } from 'zod';

const createInventorySchema = z.object({
  name: z.string(),
  itemTypeId: z.string().uuid().optional(),
  description: z.string(),
  partNumber: z.string(),
  vendorId: z.string().uuid().optional(),
  quantity: z.number().int().positive(),
  expenseAccount: z.string(),
  cost: z.number().positive(),
  locationId: z.string().uuid().optional(),
  binOrShelfNumber: z.string().optional(),
});

const updateInventorySchema = z.object({
  name: z.string().optional(),
  itemTypeId: z.string().uuid().optional(),
  description: z.string().optional(),
  partNumber: z.string().optional(),
  vendorId: z.string().uuid().optional(),
  quantity: z.number().int().positive().optional(),
  expenseAccount: z.string().optional(),
  cost: z.number().positive().optional(),
  locationId: z.string().uuid().optional(),
  binOrShelfNumber: z.string().optional(),
});

export async function getAllInventory(req: Request, res: Response) {
  try {
    const inventory = await inventoryService.findAllInventory();
    res.json(inventory);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory' });
  }
}

export async function createInventory(req: Request, res: Response) {
  try {
    const validatedData = createInventorySchema.parse(req.body);
    const newInventory = await inventoryService.createInventory(validatedData);
    res.status(201).json(newInventory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create inventory' });
    }
  }
}

export async function getInventoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const inventoryItem = await inventoryService.findInventoryById(id);
    if (inventoryItem) {
      res.json(inventoryItem);
    } else {
      res.status(404).json({ error: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve inventory item' });
  }
}

export async function updateInventory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateInventorySchema.parse(req.body);
    const updatedInventory = await inventoryService.updateInventory(id, validatedData);
    if (updatedInventory) {
      res.json(updatedInventory);
    } else {
      res.status(404).json({ error: 'Inventory item not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update inventory item' });
    }
  }
}

export async function deleteInventory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await inventoryService.deleteInventory(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Inventory item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
