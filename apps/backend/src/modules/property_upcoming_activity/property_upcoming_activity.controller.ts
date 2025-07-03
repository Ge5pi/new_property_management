import { Request, Response } from 'express';
import * as propertyUpcomingActivityService from './property_upcoming_activity.service';
import { z } from 'zod';

const createPropertyUpcomingActivitySchema = z.object({
  parentPropertyId: z.string().uuid(),
});

const updatePropertyUpcomingActivitySchema = z.object({
  parentPropertyId: z.string().uuid().optional(),
});

export async function getAllPropertyUpcomingActivities(req: Request, res: Response) {
  try {
    const propertyUpcomingActivities = await propertyUpcomingActivityService.findAllPropertyUpcomingActivities();
    res.json(propertyUpcomingActivities);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property upcoming activities' });
  }
}

export async function createPropertyUpcomingActivity(req: Request, res: Response) {
  try {
    const validatedData = createPropertyUpcomingActivitySchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      parent_property_id: validatedData.parentPropertyId,
    };
    const newPropertyUpcomingActivity = await propertyUpcomingActivityService.createPropertyUpcomingActivity(mappedData);
    res.status(201).json(newPropertyUpcomingActivity);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create property upcoming activity' });
    }
  }
}

export async function getPropertyUpcomingActivityById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const propertyUpcomingActivity = await propertyUpcomingActivityService.findPropertyUpcomingActivityById(id);
    if (propertyUpcomingActivity) {
      res.json(propertyUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Property upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve property upcoming activity' });
  }
}

export async function updatePropertyUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePropertyUpcomingActivitySchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      parent_property_id: validatedData.parentPropertyId,
    };
    const updatedPropertyUpcomingActivity = await propertyUpcomingActivityService.updatePropertyUpcomingActivity(id, mappedData);
    if (updatedPropertyUpcomingActivity) {
      res.json(updatedPropertyUpcomingActivity);
    } else {
      res.status(404).json({ error: 'Property upcoming activity not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update property upcoming activity' });
    }
  }
}

export async function deletePropertyUpcomingActivity(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await propertyUpcomingActivityService.deletePropertyUpcomingActivity(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Property upcoming activity not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
