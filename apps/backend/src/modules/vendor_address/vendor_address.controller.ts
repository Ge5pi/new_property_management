import { Request, Response } from 'express';
import * as vendorAddressService from './vendor_address.service';
import { z } from 'zod';

const createVendorAddressSchema = z.object({
  streetAddress: z.string(),
  city: z.string(),
  state: z.string(),
  country: z.string(),
  zip: z.string(),
  vendorId: z.string().uuid(),
});

const updateVendorAddressSchema = z.object({
  streetAddress: z.string().optional(),
  city: z.string().optional(),
  state: z.string().optional(),
  country: z.string().optional(),
  zip: z.string().optional(),
  vendorId: z.string().uuid().optional(),
});

export async function getAllVendorAddresses(req: Request, res: Response) {
  try {
    const vendorAddresses = await vendorAddressService.findAllVendorAddresses();
    res.json(vendorAddresses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor addresses' });
  }
}

export async function createVendorAddress(req: Request, res: Response) {
  try {
    const validatedData = createVendorAddressSchema.parse(req.body);
    const newVendorAddress = await vendorAddressService.createVendorAddress(validatedData);
    res.status(201).json(newVendorAddress);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create vendor address' });
    }
  }
}

export async function getVendorAddressById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const vendorAddress = await vendorAddressService.findVendorAddressById(id);
    if (vendorAddress) {
      res.json(vendorAddress);
    } else {
      res.status(404).json({ error: 'Vendor address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor address' });
  }
}

export async function updateVendorAddress(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateVendorAddressSchema.parse(req.body);
    const updatedVendorAddress = await vendorAddressService.updateVendorAddress(id, validatedData);
    if (updatedVendorAddress) {
      res.json(updatedVendorAddress);
    } else {
      res.status(404).json({ error: 'Vendor address not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update vendor address' });
    }
  }
}

export async function deleteVendorAddress(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await vendorAddressService.deleteVendorAddress(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Vendor address not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
