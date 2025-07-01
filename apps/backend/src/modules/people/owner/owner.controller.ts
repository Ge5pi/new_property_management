import { Request, Response } from 'express';
import * as ownerService from './owner.service';

export async function getAllOwners(req: Request, res: Response) {
  try {
    const owners = await ownerService.findAllOwners();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve owners' });
  }
}
