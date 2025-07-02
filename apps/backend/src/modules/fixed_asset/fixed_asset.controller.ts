import { Request, Response } from 'express';
import * as fixedAssetService from './fixed_asset.service';
import { z } from 'zod';

const createFixedAssetSchema = z.object({
  status: z.enum(['IN_STORAGE', 'INSTALLED']).optional(),
  placedInServiceDate: z.string().datetime().optional(),
  warrantyExpirationDate: z.string().datetime().optional(),
  unitId: z.string().uuid(),
  inventoryItemId: z.string().uuid(),
  quantity: z.number().int().positive(),
  cost: z.number().positive(),
});

const updateFixedAssetSchema = z.object({
  status: z.enum(['IN_STORAGE', 'INSTALLED']).optional(),
  placedInServiceDate: z.string().datetime().optional(),
  warrantyExpirationDate: z.string().datetime().optional(),
  unitId: z.string().uuid().optional(),
  inventoryItemId: z.string().uuid().optional(),
  quantity: z.number().int().positive().optional(),
  cost: z.number().positive().optional(),
});

export async function getAllFixedAssets(req: Request, res: Response) {
  try {
    const fixedAssets = await fixedAssetService.findAllFixedAssets();
    res.json(fixedAssets);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve fixed assets' });
  }
}

export async function createFixedAsset(req: Request, res: Response) {
  try {
    const validatedData = createFixedAssetSchema.parse(req.body);
    const newFixedAsset = await fixedAssetService.createFixedAsset(validatedData);
    res.status(201).json(newFixedAsset);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create fixed asset' });
    }
  }
}

export async function getFixedAssetById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const fixedAsset = await fixedAssetService.findFixedAssetById(id);
    if (fixedAsset) {
      res.json(fixedAsset);
    } else {
      res.status(404).json({ error: 'Fixed asset not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve fixed asset' });
  }
}

export async function updateFixedAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateFixedAssetSchema.parse(req.body);
    const updatedFixedAsset = await fixedAssetService.updateFixedAsset(id, validatedData);
    if (updatedFixedAsset) {
      res.json(updatedFixedAsset);
    } else {
      res.status(404).json({ error: 'Fixed asset not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update fixed asset' });
    }
  }
}

export async function deleteFixedAsset(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await fixedAssetService.deleteFixedAsset(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Fixed asset not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
