import { Request, Response } from 'express';
import * as rentalApplicationPetsService from './rental_application_pets.service';
import { z } from 'zod';

const createRentalApplicationPetsSchema = z.object({
  name: z.string(),
  petType: z.string(),
  weight: z.number().optional(),
  age: z.number().int().optional(),
  rentalApplicationId: z.string().uuid(),
});

const updateRentalApplicationPetsSchema = z.object({
  name: z.string().optional(),
  petType: z.string().optional(),
  weight: z.number().optional(),
  age: z.number().int().optional(),
  rentalApplicationId: z.string().uuid().optional(),
});

export async function getAllRentalApplicationPets(req: Request, res: Response) {
  try {
    const rentalApplicationPets = await rentalApplicationPetsService.findAllRentalApplicationPets();
    res.json(rentalApplicationPets);
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function createRentalApplicationPets(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationPetsSchema.parse(req.body);
    const newRentalApplicationPets = await rentalApplicationPetsService.createRentalApplicationPets(validatedData);
    res.status(201).json(newRentalApplicationPets);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function getRentalApplicationPetsById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationPets = await rentalApplicationPetsService.findRentalApplicationPetsById(id);
    if (rentalApplicationPets) {
      res.json(rentalApplicationPets);
    } else {
      res.status(404).json({ error: 'Rental application pets not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}

export async function updateRentalApplicationPets(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationPetsSchema.parse(req.body);
    const updatedRentalApplicationPets = await rentalApplicationPetsService.updateRentalApplicationPets(id, validatedData);
    if (updatedRentalApplicationPets) {
      res.json(updatedRentalApplicationPets);
    } else {
      res.status(404).json({ error: 'Rental application pets not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteRentalApplicationPets(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationPetsService.deleteRentalApplicationPets(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application pets not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
