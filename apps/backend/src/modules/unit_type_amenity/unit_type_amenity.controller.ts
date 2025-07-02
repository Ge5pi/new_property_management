import { Request, Response } from 'express';
import * as unitTypeAmenityService from './unit_type_amenity.service';
import { z } from 'zod';

const createUnitTypeAmenitySchema = z.object({
  amenityId: z.string().uuid(),
  unitTypeId: z.string().uuid(),
});

const updateUnitTypeAmenitySchema = z.object({
  amenityId: z.string().uuid().optional(),
  unitTypeId: z.string().uuid().optional(),
});

export async function getAllUnitTypeAmenities(req: Request, res: Response) {
  try {
    const unitTypeAmenities = await unitTypeAmenityService.findAllUnitTypeAmenities();
    res.json(unitTypeAmenities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit type amenities' });
  }
}

export async function createUnitTypeAmenity(req: Request, res: Response) {
  try {
    const validatedData = createUnitTypeAmenitySchema.parse(req.body);
    const newUnitTypeAmenity = await unitTypeAmenityService.createUnitTypeAmenity(validatedData);
    res.status(201).json(newUnitTypeAmenity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create unit type amenity' });
    }
  }
}

export async function getUnitTypeAmenityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const unitTypeAmenity = await unitTypeAmenityService.findUnitTypeAmenityById(id);
    if (unitTypeAmenity) {
      res.json(unitTypeAmenity);
    } else {
      res.status(404).json({ error: 'Unit type amenity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit type amenity' });
  }
}

export async function updateUnitTypeAmenity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateUnitTypeAmenitySchema.parse(req.body);
    const updatedUnitTypeAmenity = await unitTypeAmenityService.updateUnitTypeAmenity(id, validatedData);
    if (updatedUnitTypeAmenity) {
      res.json(updatedUnitTypeAmenity);
    } else {
      res.status(404).json({ error: 'Unit type amenity not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update unit type amenity' });
    }
  }
}

export async function deleteUnitTypeAmenity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await unitTypeAmenityService.deleteUnitTypeAmenity(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Unit type amenity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
