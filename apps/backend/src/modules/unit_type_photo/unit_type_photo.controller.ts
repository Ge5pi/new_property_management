import { Request, Response } from 'express';
import * as unitTypePhotoService from './unit_type_photo.service';
import { z } from 'zod';

const createUnitTypePhotoSchema = z.object({
  image: z.string(),
  isCover: z.boolean().default(false),
  unitTypeId: z.string().uuid(),
});

const updateUnitTypePhotoSchema = z.object({
  image: z.string().optional(),
  isCover: z.boolean().optional(),
  unitTypeId: z.string().uuid().optional(),
});

export async function getAllUnitTypePhotos(req: Request, res: Response) {
  try {
    const unitTypePhotos = await unitTypePhotoService.findAllUnitTypePhotos();
    res.json(unitTypePhotos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit type photos' });
  }
}

export async function createUnitTypePhoto(req: Request, res: Response) {
  try {
    const validatedData = createUnitTypePhotoSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      unit_type_id: validatedData.unitTypeId,
      image: validatedData.image,
      is_cover: validatedData.isCover,
    };
    const newUnitTypePhoto = await unitTypePhotoService.createUnitTypePhoto(mappedData);
    res.status(201).json(newUnitTypePhoto);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create unit type photo' });
    }
  }
}

export async function getUnitTypePhotoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const unitTypePhoto = await unitTypePhotoService.findUnitTypePhotoById(id);
    if (unitTypePhoto) {
      res.json(unitTypePhoto);
    } else {
      res.status(404).json({ error: 'Unit type photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit type photo' });
  }
}

export async function updateUnitTypePhoto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateUnitTypePhotoSchema.parse(req.body);
    const updatedUnitTypePhoto = await unitTypePhotoService.updateUnitTypePhoto(id, validatedData);
    if (updatedUnitTypePhoto) {
      res.json(updatedUnitTypePhoto);
    } else {
      res.status(404).json({ error: 'Unit type photo not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update unit type photo' });
    }
  }
}

export async function deleteUnitTypePhoto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await unitTypePhotoService.deleteUnitTypePhoto(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Unit type photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
