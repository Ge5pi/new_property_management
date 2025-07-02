import { Request, Response } from 'express';
import * as tenantUpcomingActivityService from './tenant_upcoming_activity.service';
import { z } from 'zod';

const createTenantUpcomingActivitySchema = z.object({
  tenantId: z.string().uuid(),
});

const updateTenantUpcomingActivitySchema = z.object({
  tenantId: z.string().uuid().optional(),
});

export async function getAllTenantUpcomingActivities(req: Request, res: Response) {
  try {
    const tenantUpcomingActivities = await tenantUpcomingActivityService.findAllTenantUpcomingActivities();
    res.json(tenantUpcomingActivities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenant upcoming activities' });
  }
}

export async function createTenantUpcomingActivity(req: Request, res: Response) {
  try {
    const validatedData = createTenantUpcomingActivitySchema.parse(req.body);
    const newTenantUpcomingActivity = await tenantUpcomingActivityService.createTenantUpcomingActivity(validatedData);
    res.status(201).json(newTenantUpcomingActivity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create tenant upcoming activity' });
    }
  }
}

export async function getTenantUpcomingActivityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const tenantUpcomingActivity = await tenantUpcomingActivityService.findTenantUpcomingActivityById(id);
    if (tenantUpcomingActivity) {
      res.json(tenantUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Tenant upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenant upcoming activity' });
  }
}

export async function updateTenantUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateTenantUpcomingActivitySchema.parse(req.body);
    const updatedTenantUpcomingActivity = await tenantUpcomingActivityService.updateTenantUpcomingActivity(id, validatedData);
    if (updatedTenantUpcomingActivity) {
      res.json(updatedTenantUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Tenant upcoming activity not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update tenant upcoming activity' });
    }
  }
}

export async function deleteTenantUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await tenantUpcomingActivityService.deleteTenantUpcomingActivity(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Tenant upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
