import { Request, Response } from 'express';
import * as rentalApplicationResidentialHistoryService from './rental_application_residential_history.service';
import { z } from 'zod';

const createRentalApplicationResidentialHistorySchema = z.object({
  currentAddress: z.string(),
  currentAddress2: z.string().optional(),
  currentCity: z.string().optional(),
  currentZipCode: z.string().optional(),
  currentCountry: z.string(),
  residentFrom: z.string().datetime().optional(),
  residentTo: z.string().datetime().optional(),
  landlordName: z.string().optional(),
  landlordPhoneNumber: z.string().optional(),
  landlordEmail: z.string().email().optional(),
  reasonOfLeaving: z.string().optional(),
  monthlyRent: z.number().positive().optional(),
  currentState: z.string().optional(),
  rentalApplicationId: z.string().uuid(),

  previousAddress: z.string().optional(),
  previousAddress2: z.string().optional(),
  previousCity: z.string().optional(),
  previousState: z.string().optional(),
  previousZipCode: z.string().optional(),
  previousCountry: z.string().optional(),
  previousResidentTo: z.string().datetime().optional(),
});

const updateRentalApplicationResidentialHistorySchema = z.object({
  currentAddress: z.string().optional(),
  currentAddress2: z.string().optional(),
  currentCity: z.string().optional(),
  currentZipCode: z.string().optional(),
  currentCountry: z.string().optional(),
  residentFrom: z.string().datetime().optional(),
  residentTo: z.string().datetime().optional(),
  landlordName: z.string().optional(),
  landlordPhoneNumber: z.string().optional(),
  landlordEmail: z.string().email().optional(),
  reasonOfLeaving: z.string().optional(),
  monthlyRent: z.number().positive().optional(),
  currentState: z.string().optional(),
  rentalApplicationId: z.string().uuid().optional(),

  previousAddress: z.string().optional(),
  previousAddress2: z.string().optional(),
  previousCity: z.string().optional(),
  previousState: z.string().optional(),
  previousZipCode: z.string().optional(),
  previousCountry: z.string().optional(),
  previousResidentTo: z.string().datetime().optional(),
});

export async function getAllRentalApplicationResidentialHistories(req: Request, res: Response) {
  try {
    const rentalApplicationResidentialHistories = await rentalApplicationResidentialHistoryService.findAllRentalApplicationResidentialHistories();
    res.json(rentalApplicationResidentialHistories);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application residential histories' });
  }
}

export async function createRentalApplicationResidentialHistory(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationResidentialHistorySchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      rental_application_id: validatedData.rentalApplicationId,
      current_address: validatedData.currentAddress,
      current_address_2: validatedData.currentAddress2,
      current_city: validatedData.currentCity,
      current_state: validatedData.currentState,
      current_zip_code: validatedData.currentZipCode,
      current_country: validatedData.currentCountry,
      resident_to: validatedData.residentTo,
      previous_address: validatedData.previousAddress,
      previous_address_2: validatedData.previousAddress2,
      previous_city: validatedData.previousCity,
      previous_state: validatedData.previousState,
      previous_zip_code: validatedData.previousZipCode,
      previous_country: validatedData.previousCountry,
      previous_resident_to: validatedData.previousResidentTo,
    };
    const newRentalApplicationResidentialHistory = await rentalApplicationResidentialHistoryService.createRentalApplicationResidentialHistory(mappedData);
    res.status(201).json(newRentalApplicationResidentialHistory);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rental application residential history' });
    }
  }
}

export async function getRentalApplicationResidentialHistoryById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationResidentialHistory = await rentalApplicationResidentialHistoryService.findRentalApplicationResidentialHistoryById(id);
    if (rentalApplicationResidentialHistory) {
      res.json(rentalApplicationResidentialHistory);
    } else {
      res.status(404).json({ error: 'Rental application residential history not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application residential history' });
  }
}

export async function updateRentalApplicationResidentialHistory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationResidentialHistorySchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      rental_application_id: validatedData.rentalApplicationId,
      current_address: validatedData.currentAddress,
      current_address_2: validatedData.currentAddress2,
      current_city: validatedData.currentCity,
      current_state: validatedData.currentState,
      current_zip_code: validatedData.currentZipCode,
      current_country: validatedData.currentCountry,
      resident_to: validatedData.residentTo,
      previous_address: validatedData.previousAddress,
      previous_address_2: validatedData.previousAddress2,
      previous_city: validatedData.previousCity,
      previous_state: validatedData.previousState,
      previous_zip_code: validatedData.previousZipCode,
      previous_country: validatedData.previousCountry,
      previous_resident_to: validatedData.previousResidentTo,
    };
    const updatedRentalApplicationResidentialHistory = await rentalApplicationResidentialHistoryService.updateRentalApplicationResidentialHistory(id, mappedData);
    if (updatedRentalApplicationResidentialHistory) {
      res.json(updatedRentalApplicationResidentialHistory);
    } else {
      res.status(404).json({ error: 'Rental application residential history not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rental application residential history' });
    }
  }
}

export async function deleteRentalApplicationResidentialHistory(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationResidentialHistoryService.deleteRentalApplicationResidentialHistory(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application residential history not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
