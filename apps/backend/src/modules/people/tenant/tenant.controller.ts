import { Request, Response } from 'express';
import * as tenantService from './tenant.service';

export async function getAllTenants(req: Request, res: Response) {
  try {
    const tenants = await tenantService.findAllTenants();
    res.json(tenants);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve tenants' });
  }
}
