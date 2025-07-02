import { Request, Response } from 'express';
import * as rentalApplicationAdditionalIncomeService from './rental_application_additional_income.service';
import { z } from 'zod';

const createRentalApplicationAdditionalIncomeSchema = z.object({
  monthlyIncome: z.number().positive(),
  sourceOfIncome: z.string(),
  rentalApplicationId: z.string().uuid(),
});

const updateRentalApplicationAdditionalIncomeSchema = z.object({
  monthlyIncome: z.number().positive().optional(),
  sourceOfIncome: z.string().optional(),
  rentalApplicationId: z.string().uuid().optional(),
});

export async function getAllRentalApplicationAdditionalIncome(req: Request, res: Response) {
  try {
    const rentalApplicationAdditionalIncome = await rentalApplicationAdditionalIncomeService.findAllRentalApplicationAdditionalIncome();
    res.json(rentalApplicationAdditionalIncome);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application additional income' });
  }
}

export async function createRentalApplicationAdditionalIncome(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationAdditionalIncomeSchema.parse(req.body);
    const newRentalApplicationAdditionalIncome = await rentalApplicationAdditionalIncomeService.createRentalApplicationAdditionalIncome(validatedData);
    res.status(201).json(newRentalApplicationAdditionalIncome);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function getRentalApplicationAdditionalIncomeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationAdditionalIncome = await rentalApplicationAdditionalIncomeService.findRentalApplicationAdditionalIncomeById(id);
    if (rentalApplicationAdditionalIncome) {
      res.json(rentalApplicationAdditionalIncome);
    } else {
      res.status(404).json({ error: 'Rental application additional income not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application additional income' });
  }
}

export async function updateRentalApplicationAdditionalIncome(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationAdditionalIncomeSchema.parse(req.body);
    const updatedRentalApplicationAdditionalIncome = await rentalApplicationAdditionalIncomeService.updateRentalApplicationAdditionalIncome(id, validatedData);
    if (updatedRentalApplicationAdditionalIncome) {
      res.json(updatedRentalApplicationAdditionalIncome);
    } else {
      res.status(404).json({ error: 'Rental application additional income not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteRentalApplicationAdditionalIncome(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationAdditionalIncomeService.deleteRentalApplicationAdditionalIncome(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application additional income not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
