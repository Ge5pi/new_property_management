import { Request, Response } from 'express';
import * as rentalApplicationEmergencyContactService from './rental_application_emergency_contact.service';
import { z } from 'zod';

const createRentalApplicationEmergencyContactSchema = z.object({
  name: z.string(),
  phoneNumber: z.string(),
  relationship: z.string(),
  address: z.string(),
  rentalApplicationId: z.string().uuid(),
});

const updateRentalApplicationEmergencyContactSchema = z.object({
  name: z.string().optional(),
  phoneNumber: z.string().optional(),
  relationship: z.string().optional(),
  address: z.string().optional(),
  rentalApplicationId: z.string().uuid().optional(),
});

export async function getAllRentalApplicationEmergencyContacts(req: Request, res: Response) {
  try {
    const rentalApplicationEmergencyContacts = await rentalApplicationEmergencyContactService.findAllRentalApplicationEmergencyContacts();
    res.json(rentalApplicationEmergencyContacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application emergency contacts' });
  }
}

export async function createRentalApplicationEmergencyContact(req: Request, res: Response) {
  try {
    const validatedData = createRentalApplicationEmergencyContactSchema.parse(req.body);
    const newRentalApplicationEmergencyContact = await rentalApplicationEmergencyContactService.createRentalApplicationEmergencyContact(validatedData);
    res.status(201).json(newRentalApplicationEmergencyContact);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create rental application emergency contact' });
    }
  }
}

export async function getRentalApplicationEmergencyContactById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const rentalApplicationEmergencyContact = await rentalApplicationEmergencyContactService.findRentalApplicationEmergencyContactById(id);
    if (rentalApplicationEmergencyContact) {
      res.json(rentalApplicationEmergencyContact);
    } else {
      res.status(404).json({ error: 'Rental application emergency contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental application emergency contact' });
  }
}

export async function updateRentalApplicationEmergencyContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateRentalApplicationEmergencyContactSchema.parse(req.body);
    const updatedRentalApplicationEmergencyContact = await rentalApplicationEmergencyContactService.updateRentalApplicationEmergencyContact(id, validatedData);
    if (updatedRentalApplicationEmergencyContact) {
      res.json(updatedRentalApplicationEmergencyContact);
    } else {
      res.status(404).json({ error: 'Rental application emergency contact not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update rental application emergency contact' });
    }
  }
}

export async function deleteRentalApplicationEmergencyContact(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await rentalApplicationEmergencyContactService.deleteRentalApplicationEmergencyContact(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Rental application emergency contact not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
