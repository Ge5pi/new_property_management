import { Request, Response } from 'express';
import * as tenantService from './tenant.service';
import { z } from 'zod';

const createTenantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

const updateTenantSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function getAllTenants(req: Request, res: Response) {
  try {
    const tenants = await tenantService.findAllTenants();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenants' });
  }
}

export async function createTenant(req: Request, res: Response) {
  try {
    const validatedData = createTenantSchema.parse(req.body);
    const newTenant = await tenantService.createTenant(validatedData);
    res.status(201).json(newTenant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create tenant' });
    }
  }
}

export async function getTenantById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenant = await tenantService.findTenantById(id);
    if (tenant) {
      res.json(tenant);
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenant' });
  }
}

export async function updateTenant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateTenantSchema.parse(req.body);
    const updatedTenant = await tenantService.updateTenant(id, validatedData);
    if (updatedTenant) {
      res.json(updatedTenant);
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update tenant' });
    }
  }
}

export async function deleteTenant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await tenantService.deleteTenant(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tenant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
