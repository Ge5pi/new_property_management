import { Request, Response } from 'express';
import * as propertyOwnerService from './property_owner.service';
import { z } from 'zod';

const createPropertyOwnerSchema = z.object({
  percentageOwned: z.number().int().min(0).max(100),
  parentPropertyId: z.string().uuid(),
  paymentType: z.enum(['NET_INCOME', 'FLAT']),
  contractExpiry: z.string().datetime(),
  reserveFunds: z.number().positive(),
  fiscalYearEnd: z.string(),
  ownershipStartDate: z.string().datetime(),
  ownerId: z.string().uuid(),
});

const updatePropertyOwnerSchema = z.object({
  percentageOwned: z.number().int().min(0).max(100).optional(),
  parentPropertyId: z.string().uuid().optional(),
  paymentType: z.enum(['NET_INCOME', 'FLAT']).optional(),
  contractExpiry: z.string().datetime().optional(),
  reserveFunds: z.number().positive().optional(),
  fiscalYearEnd: z.string().optional(),
  ownershipStartDate: z.string().datetime().optional(),
  ownerId: z.string().uuid().optional(),
});

export async function getAllPropertyOwners(req: Request, res: Response) {
  try {
    const propertyOwners = await propertyOwnerService.findAllPropertyOwners();
    res.json(propertyOwners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property owners' });
  }
}

export async function createPropertyOwner(req: Request, res: Response) {
  try {
    const validatedData = createPropertyOwnerSchema.parse(req.body);
    const newPropertyOwner = await propertyOwnerService.createPropertyOwner(validatedData);
    res.status(201).json(newPropertyOwner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property owner' });
    }
  }
}

export async function getPropertyOwnerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyOwner = await propertyOwnerService.findPropertyOwnerById(id);
    if (propertyOwner) {
      res.json(propertyOwner);
    } else {
      res.status(404).json({ error: 'Property owner not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property owner' });
  }
}

export async function updatePropertyOwner(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyOwnerSchema.parse(req.body);
    const updatedPropertyOwner = await propertyOwnerService.updatePropertyOwner(id, validatedData);
    if (updatedPropertyOwner) {
      res.json(updatedPropertyOwner);
    } else {
      res.status(404).json({ error: 'Property owner not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property owner' });
    }
  }
}

export async function deletePropertyOwner(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyOwnerService.deletePropertyOwner(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property owner not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
