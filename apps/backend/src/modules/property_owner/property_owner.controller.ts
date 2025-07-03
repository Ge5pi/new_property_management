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
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      parent_property_id: validatedData.parentPropertyId,
      percentage_owned: validatedData.percentageOwned,
      payment_type: validatedData.paymentType,
      contract_expiry: validatedData.contractExpiry,
      reserve_funds: validatedData.reserveFunds,
      fiscal_year_end: validatedData.fiscalYearEnd,
      ownership_start_date: validatedData.ownershipStartDate,
      owner_id: validatedData.ownerId,
    };
    const newPropertyOwner = await propertyOwnerService.createPropertyOwner(mappedData);
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
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      percentage_owned: validatedData.percentageOwned,
      parent_property_id: validatedData.parentPropertyId,
      payment_type: validatedData.paymentType,
      contract_expiry: validatedData.contractExpiry,
      reserve_funds: validatedData.reserveFunds,
      fiscal_year_end: validatedData.fiscalYearEnd,
      ownership_start_date: validatedData.ownershipStartDate,
      owner_id: validatedData.ownerId,
    };
    const updatedPropertyOwner = await propertyOwnerService.updatePropertyOwner(id, mappedData);
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
