import { Request, Response } from 'express';
import * as leaseService from './lease.service';

export async function getAllLeases(req: Request, res: Response) {
  try {
    const leases = await leaseService.findAllLeases();
    res.json(leases);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve leases' });
  }
}
