import { Request, Response } from 'express';
import * as propertyService from './property.service';

export async function getAllProperties(req: Request, res: Response) {
  try {
    const properties = await propertyService.findAllProperties();
    res.json(properties);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve properties' });
  }
}
