import { Request, Response } from 'express';
import * as ownerService from './owner.service';
import { z } from 'zod';

const createOwnerSchema = z.object({
  firstName: z.string(),
  lastName: z.string(),
  email: z.string().email(),
  phone: z.string().optional(),
});

const updateOwnerSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
  phone: z.string().optional(),
});

export async function getAllOwners(req: Request, res: Response) {
  try {
    const owners = await ownerService.findAllOwners();
    res.json(owners);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve owners' });
  }
}

export async function createOwner(req: Request, res: Response) {
  try {
    const validatedData = createOwnerSchema.parse(req.body);
    const newOwner = await ownerService.createOwner(validatedData);
    res.status(201).json(newOwner);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create owner' });
    }
  }
}

export async function getOwnerById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const owner = await ownerService.findOwnerById(id);
    if (owner) {
      res.json(owner);
    } else {
      res.status(404).json({ error: 'Owner not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve owner' });
  }
}

export async function updateOwner(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateOwnerSchema.parse(req.body);
    const updatedOwner = await ownerService.updateOwner(id, validatedData);
    if (updatedOwner) {
      res.json(updatedOwner);
    } else {
      res.status(404).json({ error: 'Owner not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteOwner(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await ownerService.deleteOwner(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Owner not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
