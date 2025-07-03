import { Request, Response } from 'express';
import * as unitPhotoService from './unit_photo.service';
import { z } from 'zod';

const createUnitPhotoSchema = z.object({
  image: z.string(),
  isCover: z.boolean().default(false),
  unitId: z.string().uuid(),
});

const updateUnitPhotoSchema = z.object({
  image: z.string().optional(),
  isCover: z.boolean().optional(),
  unitId: z.string().uuid().optional(),
});

export async function getAllUnitPhotos(req: Request, res: Response) {
  try {
    const unitPhotos = await unitPhotoService.findAllUnitPhotos();
    res.json(unitPhotos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit photos' });
  }
}

export async function createUnitPhoto(req: Request, res: Response) {
  try {
    const validatedData = createUnitPhotoSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      unit_id: validatedData.unitId,
      image: validatedData.image,
      is_cover: validatedData.isCover,
    };
    const newUnitPhoto = await unitPhotoService.createUnitPhoto(mappedData);
    res.status(201).json(newUnitPhoto);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create unit photo' });
    }
  }
}

export async function getUnitPhotoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const unitPhoto = await unitPhotoService.findUnitPhotoById(id);
    if (unitPhoto) {
      res.json(unitPhoto);
    } else {
      res.status(404).json({ error: 'Unit photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit photo' });
  }
}

export async function updateUnitPhoto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateUnitPhotoSchema.parse(req.body);
    const updatedUnitPhoto = await unitPhotoService.updateUnitPhoto(id, validatedData);
    if (updatedUnitPhoto) {
      res.json(updatedUnitPhoto);
    } else {
      res.status(404).json({ error: 'Unit photo not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update unit photo' });
    }
  }
}

export async function deleteUnitPhoto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await unitPhotoService.deleteUnitPhoto(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Unit photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
