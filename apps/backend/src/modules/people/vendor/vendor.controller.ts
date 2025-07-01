import { Request, Response } from 'express';
import * as vendorService from './vendor.service';

export async function getAllVendors(req: Request, res: Response) {
  try {
    const vendors = await vendorService.findAllVendors();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendors' });
  }
}
