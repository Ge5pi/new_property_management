import { Request, Response } from 'express';
import * as rentalApplicationService from './rental_application.service';

export async function getAllRentalApplications(req: Request, res: Response) {
  try {
    const rentalApplications = await rentalApplicationService.findAllRentalApplications();
    res.json(rentalApplications);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve rental applications' });
  }
}
