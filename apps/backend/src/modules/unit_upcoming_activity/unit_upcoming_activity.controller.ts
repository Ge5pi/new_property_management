import { Request, Response } from 'express';
import * as unitUpcomingActivityService from './unit_upcoming_activity.service';
import { z } from 'zod';

const createUnitUpcomingActivitySchema = z.object({
  unitId: z.string().uuid(),
});

const updateUnitUpcomingActivitySchema = z.object({
  unitId: z.string().uuid().optional(),
});

export async function getAllUnitUpcomingActivities(req: Request, res: Response) {
  try {
    const unitUpcomingActivities = await unitUpcomingActivityService.findAllUnitUpcomingActivities();
    res.json(unitUpcomingActivities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit upcoming activities' });
  }
}

export async function createUnitUpcomingActivity(req: Request, res: Response) {
  try {
    const validatedData = createUnitUpcomingActivitySchema.parse(req.body);
    const newUnitUpcomingActivity = await unitUpcomingActivityService.createUnitUpcomingActivity(validatedData);
    res.status(201).json(newUnitUpcomingActivity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create unit upcoming activity' });
    }
  }
}

export async function getUnitUpcomingActivityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const unitUpcomingActivity = await unitUpcomingActivityService.findUnitUpcomingActivityById(id);
    if (unitUpcomingActivity) {
      res.json(unitUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Unit upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit upcoming activity' });
  }
}

export async function updateUnitUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateUnitUpcomingActivitySchema.parse(req.body);
    const updatedUnitUpcomingActivity = await unitUpcomingActivityService.updateUnitUpcomingActivity(id, validatedData);
    if (updatedUnitUpcomingActivity) {
      res.json(updatedUnitUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Unit upcoming activity not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update unit upcoming activity' });
    }
  }
}

export async function deleteUnitUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await unitUpcomingActivityService.deleteUnitUpcomingActivity(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Unit upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
