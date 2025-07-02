import { Request, Response } from 'express';
import * as propertyService from './property.service';
import { z } from 'zod';

const createPropertySchema = z.object({
  name: z.string(),
  address: z.string(),
  unitCount: z.number().int().positive(),
  property_type_id: z.string(),
});

const updatePropertySchema = z.object({
  name: z.string().optional(),
  address: z.string().optional(),
  unitCount: z.number().int().positive().optional(),
});

export async function getAllProperties(req: Request, res: Response) {
  try {
    const properties = await propertyService.findAllProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
}

export async function createProperty(req: Request, res: Response) {
  try {
    const validatedData = createPropertySchema.parse(req.body);
    // Add default values for id and updatedAt to satisfy type requirements
    const propertyDataWithDefaults = {
      id: '', // or generate a UUID if needed
      updatedAt: new Date(),
      ...validatedData,
    };
    const newProperty = await propertyService.createProperty(propertyDataWithDefaults);
    res.status(201).json(newProperty);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property' });
    }
  }
}

export async function getPropertyById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const property = await propertyService.findPropertyById(id);
    if (property) {
      res.json(property);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property' });
  }
}

export async function updateProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertySchema.parse(req.body);
    const updatedProperty = await propertyService.updateProperty(id, validatedData);
    if (updatedProperty) {
      res.json(updatedProperty);
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property' });
    }
  }
}

export async function deleteProperty(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyService.deleteProperty(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
