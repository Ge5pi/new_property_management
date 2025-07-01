import { Request, Response } from 'express';
import * as unitTypeService from './unit_type.service';

export async function getAllUnitTypes(req: Request, res: Response) {
  try {
    const unitTypes = await unitTypeService.findAllUnitTypes();
    res.json(unitTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve unit types' });
  }
}
