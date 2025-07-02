import { Request, Response } from 'express';
import * as applicantService from './applicant.service';
import { z } from 'zod';

const createApplicantSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  allowEmailForRentalApplication: z.boolean().default(false),
  phoneNumber: z.string(),
  unitId: z.string().uuid(),
});

const updateApplicantSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  allowEmailForRentalApplication: z.boolean().optional(),
  phoneNumber: z.string().optional(),
  unitId: z.string().uuid().optional(),
});

export async function getAllApplicants(req: Request, res: Response) {
  try {
    const applicants = await applicantService.findAllApplicants();
    res.json(applicants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applicants' });
  }
}

export async function createApplicant(req: Request, res: Response) {
  try {
    const validatedData = createApplicantSchema.parse(req.body);
    const newApplicant = await applicantService.createApplicant(validatedData);
    res.status(201).json(newApplicant);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create applicant' });
    }
  }
}

export async function getApplicantById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const applicant = await applicantService.findApplicantById(id);
    if (applicant) {
      res.json(applicant);
    } else {
      res.status(404).json({ error: 'Applicant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve applicant' });
  }
}

export async function updateApplicant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateApplicantSchema.parse(req.body);
    const updatedApplicant = await applicantService.updateApplicant(id, validatedData);
    if (updatedApplicant) {
      res.json(updatedApplicant);
    } else {
      res.status(404).json({ error: 'Applicant not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update applicant' });
    }
  }
}

export async function deleteApplicant(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await applicantService.deleteApplicant(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Applicant not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
