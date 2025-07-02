import { Request, Response } from 'express';
import * as vendorTypeService from './vendor_type.service';
import { z } from 'zod';

const createVendorTypeSchema = z.object({
  name: z.string(),
  description: z.string(),
});

const updateVendorTypeSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
});

export async function getAllVendorTypes(req: Request, res: Response) {
  try {
    const vendorTypes = await vendorTypeService.findAllVendorTypes();
    res.json(vendorTypes);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor types' });
  }
}

export async function createVendorType(req: Request, res: Response) {
  try {
    const validatedData = createVendorTypeSchema.parse(req.body);
    const newVendorType = await vendorTypeService.createVendorType(validatedData);
    res.status(201).json(newVendorType);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create vendor type' });
    }
  }
}

export async function getVendorTypeById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const vendorType = await vendorTypeService.findVendorTypeById(id);
    if (vendorType) {
      res.json(vendorType);
    } else {
      res.status(404).json({ error: 'Vendor type not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve vendor type' });
  }
}

export async function updateVendorType(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateVendorTypeSchema.parse(req.body);
    const updatedVendorType = await vendorTypeService.updateVendorType(id, validatedData);
    if (updatedVendorType) {
      res.json(updatedVendorType);
    } else {
      res.status(404).json({ error: 'Vendor type not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update vendor type' });
    }
  }
}

export async function deleteVendorType(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await vendorTypeService.deleteVendorType(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Vendor type not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
