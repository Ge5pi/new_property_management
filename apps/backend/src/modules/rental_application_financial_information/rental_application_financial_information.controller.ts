import { Request, Response } from 'express';
import * as rentalApplicationFinancialInformationService from './rental_application_financial_information.service';
import { z } from 'zod';

const createRentalApplicationFinancialInformationSchema = z.object({
  name: z.string(),
  accountType: z.string(),
  bank: z.string(),
  accountNumber: z.string(),
  rentalApplicationId: z.string().uuid(),
});

const updateRentalApplicationFinancialInformationSchema = z.object({
  name: z.string().optional(),
  accountType: z.string().optional(),
  bank: z.string().optional(),
  accountNumber: z.string().optional(),
  rentalApplicationId: z.string().uuid().optional(),
});

export async function getAllRentalApplicationFinancialInformation(req: Request, res: Response) {
  try {
    const rentalApplicationFinancialInformation = await rentalApplicationFinancialInformationService.findAllRentalApplicationFinancialInformation();
    res.json(rentalApplicationFinancialInformation);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application financial information' });
  }
}

export async function createRentalApplicationFinancialInformation(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationFinancialInformationSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      rental_application_id: validatedData.rentalApplicationId,
      name: validatedData.name,
      account_type: validatedData.accountType,
      bank: validatedData.bank,
      account_number: validatedData.accountNumber,
    };
    const newRentalApplicationFinancialInformation = await rentalApplicationFinancialInformationService.createRentalApplicationFinancialInformation(mappedData);
    res.status(201).json(newRentalApplicationFinancialInformation);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function getRentalApplicationFinancialInformationById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationFinancialInformation = await rentalApplicationFinancialInformationService.findRentalApplicationFinancialInformationById(id);
    if (rentalApplicationFinancialInformation) {
      res.json(rentalApplicationFinancialInformation);
    } else {
      res.status(404).json({ error: 'Rental application financial information not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application financial information' });
  }
}

export async function updateRentalApplicationFinancialInformation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationFinancialInformationSchema.parse(req.body);
    const updatedRentalApplicationFinancialInformation = await rentalApplicationFinancialInformationService.updateRentalApplicationFinancialInformation(id, validatedData);
    if (updatedRentalApplicationFinancialInformation) {
      res.json(updatedRentalApplicationFinancialInformation);
    } else {
      res.status(404).json({ error: 'Rental application financial information not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteRentalApplicationFinancialInformation(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationFinancialInformationService.deleteRentalApplicationFinancialInformation(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application financial information not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
