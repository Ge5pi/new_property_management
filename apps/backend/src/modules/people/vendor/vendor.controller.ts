import { Request, Response } from 'express';
import * as vendorService from './vendor.service';
import { z } from 'zod';

const createVendorSchema = z.object({
  name: z.string(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

const updateVendorSchema = z.object({
  name: z.string().optional(),
  contactPerson: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function getAllVendors(req: Request, res: Response) {
  try {
    const vendors = await vendorService.findAllVendors();
    res.json(vendors);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendors' });
  }
}

export async function createVendor(req: Request, res: Response) {
  try {
    const validatedData = createVendorSchema.parse(req.body);
    const newVendor = await vendorService.createVendor(validatedData);
    res.status(201).json(newVendor);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create vendor' });
    }
  }
}

export async function getVendorById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const vendor = await vendorService.findVendorById(id);
    if (vendor) {
      res.json(vendor);
    } else {
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor' });
  }
}

export async function updateVendor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateVendorSchema.parse(req.body);
    const updatedVendor = await vendorService.updateVendor(id, validatedData);
    if (updatedVendor) {
      res.json(updatedVendor);
    } else {
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update vendor' });
    }
  }
}

export async function deleteVendor(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await vendorService.deleteVendor(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Vendor not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
