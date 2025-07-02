import { Request, Response } from 'express';
import * as propertyPhotoService from './property_photo.service';
import { z } from 'zod';

const createPropertyPhotoSchema = z.object({
  image: z.string(),
  isCover: z.boolean().default(false),
  parentPropertyId: z.string().uuid(),
});

const updatePropertyPhotoSchema = z.object({
  image: z.string().optional(),
  isCover: z.boolean().optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyPhotos(req: Request, res: Response) {
  try {
    const propertyPhotos = await propertyPhotoService.findAllPropertyPhotos();
    res.json(propertyPhotos);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property photos' });
  }
}

export async function createPropertyPhoto(req: Request, res: Response) {
  try {
    const validatedData = createPropertyPhotoSchema.parse(req.body);
    const newPropertyPhoto = await propertyPhotoService.createPropertyPhoto(validatedData);
    res.status(201).json(newPropertyPhoto);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property photo' });
    }
  }
}

export async function getPropertyPhotoById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyPhoto = await propertyPhotoService.findPropertyPhotoById(id);
    if (propertyPhoto) {
      res.json(propertyPhoto);
    } else {
      res.status(404).json({ error: 'Property photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property photo' });
  }
}

export async function updatePropertyPhoto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyPhotoSchema.parse(req.body);
    const updatedPropertyPhoto = await propertyPhotoService.updatePropertyPhoto(id, validatedData);
    if (updatedPropertyPhoto) {
      res.json(updatedPropertyPhoto);
    } else {
      res.status(404).json({ error: 'Property photo not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property photo' });
    }
  }
}

export async function deletePropertyPhoto(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyPhotoService.deletePropertyPhoto(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property photo not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
