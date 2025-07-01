import { Request, Response } from 'express';
import * as unitService from './unit.service';

export async function getAllUnits(req: Request, res: Response) {
  try {
    const units = await unitService.findAllUnits();
    res.json(units);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve units' });
  }
}
