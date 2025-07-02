import { Request, Response } from 'express';
import * as propertyUtilityBillingService from './property_utility_billing.service';
import { z } from 'zod';

const createPropertyUtilityBillingSchema = z.object({
  utility: z.string(),
  vendorId: z.string().uuid(),
  vendorBillGl: z.string(),
  tenantChargeGl: z.string(),
  ownerContributionPercentage: z.number().int().min(0).max(100),
  tenantContributionPercentage: z.number().int().min(0).max(100),
  parentPropertyId: z.string().uuid(),
});

const updatePropertyUtilityBillingSchema = z.object({
  utility: z.string().optional(),
  vendorId: z.string().uuid().optional(),
  vendorBillGl: z.string().optional(),
  tenantChargeGl: z.string().optional(),
  ownerContributionPercentage: z.number().int().min(0).max(100).optional(),
  tenantContributionPercentage: z.number().int().min(0).max(100).optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyUtilityBillings(req: Request, res: Response) {
  try {
    const propertyUtilityBillings = await propertyUtilityBillingService.findAllPropertyUtilityBillings();
    res.json(propertyUtilityBillings);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property utility billings' });
  }
}

export async function createPropertyUtilityBilling(req: Request, res: Response) {
  try {
    const validatedData = createPropertyUtilityBillingSchema.parse(req.body);
    const newPropertyUtilityBilling = await propertyUtilityBillingService.createPropertyUtilityBilling(validatedData);
    res.status(201).json(newPropertyUtilityBilling);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property utility billing' });
    }
  }
}

export async function getPropertyUtilityBillingById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyUtilityBilling = await propertyUtilityBillingService.findPropertyUtilityBillingById(id);
    if (propertyUtilityBilling) {
      res.json(propertyUtilityBilling);
    } else {
      res.status(404).json({ error: 'Property utility billing not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property utility billing' });
  }
}

export async function updatePropertyUtilityBilling(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyUtilityBillingSchema.parse(req.body);
    const updatedPropertyUtilityBilling = await propertyUtilityBillingService.updatePropertyUtilityBilling(id, validatedData);
    if (updatedPropertyUtilityBilling) {
      res.json(updatedPropertyUtilityBilling);
    } else {
      res.status(404).json({ error: 'Property utility billing not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property utility billing' });
    }
  }
}

export async function deletePropertyUtilityBilling(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyUtilityBillingService.deletePropertyUtilityBilling(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property utility billing not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
