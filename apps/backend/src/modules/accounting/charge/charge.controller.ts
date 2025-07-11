import { Request, Response } from 'express';
import * as chargeService from './charge.service';

export async function getAllCharges(req: Request, res: Response): Promise<void> {
  try {
    const charges = await chargeService.getAllCharges();
    res.json(charges);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get charges' });
  }
}

export async function getChargeById(req: Request, res: Response): Promise<void> {
  try {
    const charge = await chargeService.getChargeById(req.params.id);
    if (!charge) {
      res.status(404).json({ message: 'Charge not found' });
      return;
    }
    res.json(charge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get charge' });
  }
}

export async function createCharge(req: Request, res: Response): Promise<void> {
  try {
    const newCharge = await chargeService.createCharge(req.body);
    res.status(201).json(newCharge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create charge' });
  }
}

export async function updateCharge(req: Request, res: Response): Promise<void> {
  try {
    const updatedCharge = await chargeService.updateCharge(req.params.id, req.body);
    if (!updatedCharge) {
      res.status(404).json({ message: 'Charge not found' });
      return;
    }
    res.json(updatedCharge);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update charge' });
  }
}

export async function deleteCharge(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await chargeService.deleteCharge(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Charge not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete charge' });
  }
}
