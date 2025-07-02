import { Request, Response } from 'express';
import * as secondaryTenantService from './secondary_tenant.service';
import { z } from 'zod';

const createSecondaryTenantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email().optional(),
  phoneNumber: z.string(),
  birthday: z.string().datetime(),
  taxPayerId: z.string(),
  description: z.string().optional(),
  leaseId: z.string().uuid(),
});

const updateSecondaryTenantSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phoneNumber: z.string().optional(),
  birthday: z.string().datetime().optional(),
  taxPayerId: z.string().optional(),
  description: z.string().optional(),
  leaseId: z.string().uuid().optional(),
});

export async function getAllSecondaryTenants(req: Request, res: Response) {
  try {
    const secondaryTenants = await secondaryTenantService.findAllSecondaryTenants();
    res.json(secondaryTenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve secondary tenants' });
  }
}

export async function createSecondaryTenant(req: Request, res: Response) {
  try {
    const validatedData = createSecondaryTenantSchema.parse(req.body);
    const newSecondaryTenant = await secondaryTenantService.createSecondaryTenant(validatedData);
    res.status(201).json(newSecondaryTenant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create secondary tenant' });
    }
  }
}

export async function getSecondaryTenantById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const secondaryTenant = await secondaryTenantService.findSecondaryTenantById(id);
    if (secondaryTenant) {
      res.json(secondaryTenant);
    } else {
      res.status(404).json({ error: 'Secondary tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve secondary tenant' });
  }
}

export async function updateSecondaryTenant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateSecondaryTenantSchema.parse(req.body);
    const updatedSecondaryTenant = await secondaryTenantService.updateSecondaryTenant(id, validatedData);
    if (updatedSecondaryTenant) {
      res.json(updatedSecondaryTenant);
    } else {
      res.status(404).json({ error: 'Secondary tenant not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update secondary tenant' });
    }
  }
}

export async function deleteSecondaryTenant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await secondaryTenantService.deleteSecondaryTenant(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Secondary tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
