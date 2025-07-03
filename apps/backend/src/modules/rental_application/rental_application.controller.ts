import { Request, Response } from 'express';
import * as rentalApplicationService from './rental_application.service';
import { z } from 'zod';

const createRentalApplicationSchema = z.object({
  applicant_id: z.string().uuid(),
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD_OR_WAITING']).optional(),
});

const updateRentalApplicationSchema = z.object({
  status: z.enum(['DRAFT', 'PENDING', 'APPROVED', 'REJECTED', 'ON_HOLD_OR_WAITING']).optional(),
});

export async function getAllRentalApplications(req: Request, res: Response) {
  try {
    const rentalApplications = await rentalApplicationService.findAllRentalApplications();
    res.json(rentalApplications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental applications' });
  }
}

export async function createRentalApplication(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationSchema.parse(req.body);
    const newRentalApplication = await rentalApplicationService.createRentalApplication(validatedData);
    res.status(201).json(newRentalApplication);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rental application' });
    }
  }
}

export async function getRentalApplicationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplication = await rentalApplicationService.findRentalApplicationById(id);
    if (rentalApplication) {
      res.json(rentalApplication);
    } else {
      res.status(404).json({ error: 'Rental application not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application' });
  }
}

export async function updateRentalApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationSchema.parse(req.body);
    const updatedRentalApplication = await rentalApplicationService.updateRentalApplication(id, validatedData);
    if (updatedRentalApplication) {
      res.json(updatedRentalApplication);
    } else {
      res.status(404).json({ error: 'Rental application not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rental application' });
    }
  }
}

export async function deleteRentalApplication(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationService.deleteRentalApplication(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
