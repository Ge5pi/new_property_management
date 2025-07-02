import { Request, Response } from 'express';
import * as propertyLateFeePolicyService from './property_late_fee_policy.service';
import { z } from 'zod';

const createPropertyLateFeePolicySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  lateFeeType: z.enum(['PERCENTAGE', 'FLAT']).optional(),
  baseAmountFee: z.number().optional(),
  eligibleCharges: z.enum(['EVERY_CHARGE', 'ALL_RECURRING_CHARGES', 'ONLY_RECURRING_RENT']).optional(),
  chargeDailyLateFees: z.boolean().default(false),
  dailyAmountPerMonthMax: z.number().optional(),
  gracePeriodType: z.enum(['NUMBER_OF_DAY', 'TILL_DATE_OF_MONTH', 'NO_GRACE_PERIOD']).optional(),
  gracePeriod: z.number().int().optional(),
  parentPropertyId: z.string().uuid(),
});

const updatePropertyLateFeePolicySchema = z.object({
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
  lateFeeType: z.enum(['PERCENTAGE', 'FLAT']).optional(),
  baseAmountFee: z.number().optional(),
  eligibleCharges: z.enum(['EVERY_CHARGE', 'ALL_RECURRING_CHARGES', 'ONLY_RECURRING_RENT']).optional(),
  chargeDailyLateFees: z.boolean().optional(),
  dailyAmountPerMonthMax: z.number().optional(),
  gracePeriodType: z.enum(['NUMBER_OF_DAY', 'TILL_DATE_OF_MONTH', 'NO_GRACE_PERIOD']).optional(),
  gracePeriod: z.number().int().optional(),
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyLateFeePolicies(req: Request, res: Response) {
  try {
    const propertyLateFeePolicies = await propertyLateFeePolicyService.findAllPropertyLateFeePolicies();
    res.json(propertyLateFeePolicies);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property late fee policies' });
  }
}

export async function createPropertyLateFeePolicy(req: Request, res: Response) {
  try {
    const validatedData = createPropertyLateFeePolicySchema.parse(req.body);
    const newPropertyLateFeePolicy = await propertyLateFeePolicyService.createPropertyLateFeePolicy(validatedData);
    res.status(201).json(newPropertyLateFeePolicy);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property late fee policy' });
    }
  }
}

export async function getPropertyLateFeePolicyById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyLateFeePolicy = await propertyLateFeePolicyService.findPropertyLateFeePolicyById(id);
    if (propertyLateFeePolicy) {
      res.json(propertyLateFeePolicy);
    } else {
      res.status(404).json({ error: 'Property late fee policy not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property late fee policy' });
  }
}

export async function updatePropertyLateFeePolicy(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyLateFeePolicySchema.parse(req.body);
    const updatedPropertyLateFeePolicy = await propertyLateFeePolicyService.updatePropertyLateFeePolicy(id, validatedData);
    if (updatedPropertyLateFeePolicy) {
      res.json(updatedPropertyLateFeePolicy);
    } else {
      res.status(404).json({ error: 'Property late fee policy not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property late fee policy' });
    }
  }
}

export async function deletePropertyLateFeePolicy(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyLateFeePolicyService.deletePropertyLateFeePolicy(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property late fee policy not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
