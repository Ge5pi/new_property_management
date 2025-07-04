import { Request, Response } from 'express';
import * as rentalApplicationDependentService from './rental_application_dependent.service';
import { z } from 'zod';

const createRentalApplicationDependentSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  birthday: z.string().datetime(),
  relationship: z.string(),
  rentalApplicationId: z.string().uuid(),
});

const updateRentalApplicationDependentSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  birthday: z.string().datetime().optional(),
  relationship: z.string().optional(),
  rentalApplicationId: z.string().uuid().optional(),
});

export async function getAllRentalApplicationDependents(req: Request, res: Response) {
  try {
    const rentalApplicationDependents = await rentalApplicationDependentService.findAllRentalApplicationDependents();
    res.json(rentalApplicationDependents);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application dependents' });
  }
}

export async function createRentalApplicationDependent(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationDependentSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      rental_application_id: validatedData.rentalApplicationId,
      first_name: validatedData.firstName,
      last_name: validatedData.lastName,
      birthday: validatedData.birthday,
      relationship: validatedData.relationship,
    };
    const newRentalApplicationDependent = await rentalApplicationDependentService.createRentalApplicationDependent(mappedData);
    res.status(201).json(newRentalApplicationDependent);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rental application dependent' });
    }
  }
}

export async function getRentalApplicationDependentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationDependent = await rentalApplicationDependentService.findRentalApplicationDependentById(id);
    if (rentalApplicationDependent) {
      res.json(rentalApplicationDependent);
    } else {
      res.status(404).json({ error: 'Rental application dependent not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application dependent' });
  }
}

export async function updateRentalApplicationDependent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationDependentSchema.parse(req.body);
    const updatedRentalApplicationDependent = await rentalApplicationDependentService.updateRentalApplicationDependent(id, validatedData);
    if (updatedRentalApplicationDependent) {
      res.json(updatedRentalApplicationDependent);
    } else {
      res.status(404).json({ error: 'Rental application dependent not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rental application dependent' });
    }
  }
}

export async function deleteRentalApplicationDependent(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationDependentService.deleteRentalApplicationDependent(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application dependent not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
