import { Request, Response } from 'express';
import * as ownerUpcomingActivityService from './owner_upcoming_activity.service';
import { z } from 'zod';

const createOwnerUpcomingActivitySchema = z.object({
  ownerId: z.string().uuid(),
});

const updateOwnerUpcomingActivitySchema = z.object({
  ownerId: z.string().uuid().optional(),
});

export async function getAllOwnerUpcomingActivities(req: Request, res: Response) {
  try {
    const ownerUpcomingActivities = await ownerUpcomingActivityService.findAllOwnerUpcomingActivities();
    res.json(ownerUpcomingActivities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve owner upcoming activities' });
  }
}

export async function createOwnerUpcomingActivity(req: Request, res: Response) {
  try {
    const validatedData = createOwnerUpcomingActivitySchema.parse(req.body);
    const newOwnerUpcomingActivity = await ownerUpcomingActivityService.createOwnerUpcomingActivity(validatedData);
    res.status(201).json(newOwnerUpcomingActivity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create owner upcoming activity' });
    }
  }
}

export async function getOwnerUpcomingActivityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const ownerUpcomingActivity = await ownerUpcomingActivityService.findOwnerUpcomingActivityById(id);
    if (ownerUpcomingActivity) {
      res.json(ownerUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Owner upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve owner upcoming activity' });
  }
}

export async function updateOwnerUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateOwnerUpcomingActivitySchema.parse(req.body);
    const updatedOwnerUpcomingActivity = await ownerUpcomingActivityService.updateOwnerUpcomingActivity(id, validatedData);
    if (updatedOwnerUpcomingActivity) {
      res.json(updatedOwnerUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Owner upcoming activity not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update owner upcoming activity' });
    }
  }
}

export async function deleteOwnerUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await ownerUpcomingActivityService.deleteOwnerUpcomingActivity(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Owner upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
