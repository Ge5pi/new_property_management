import { Request, Response } from 'express';
import * as serviceRequestService from './service_request.service';
import { z } from 'zod';

const createServiceRequestSchema = z.object({
  unitId: z.string().uuid(),
  orderType: z.enum(['INTERNAL', 'RESIDENT', 'UNIT_TURN']),
  permissionToEnter: z.boolean().default(false),
  additionalInformationForEntry: z.string().optional(),
  priority: z.enum(['URGENT', 'NORMAL', 'LOW']),
  subject: z.string(),
  description: z.string(),
});

const updateServiceRequestSchema = z.object({
  unitId: z.string().uuid().optional(),
  orderType: z.enum(['INTERNAL', 'RESIDENT', 'UNIT_TURN']).optional(),
  permissionToEnter: z.boolean().optional(),
  additionalInformationForEntry: z.string().optional(),
  priority: z.enum(['URGENT', 'NORMAL', 'LOW']).optional(),
  subject: z.string().optional(),
  description: z.string().optional(),
});

export async function getAllServiceRequests(req: Request, res: Response) {
  try {
    const serviceRequests = await serviceRequestService.findAllServiceRequests();
    res.json(serviceRequests);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve service requests' });
  }
}

export async function createServiceRequest(req: Request, res: Response) {
  try {
    const validatedData = createServiceRequestSchema.parse(req.body);
    const newServiceRequest = await serviceRequestService.createServiceRequest(validatedData);
    res.status(201).json(newServiceRequest);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create service request' });
    }
  }
}

export async function getServiceRequestById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const serviceRequest = await serviceRequestService.findServiceRequestById(id);
    if (serviceRequest) {
      res.json(serviceRequest);
    } else {
      res.status(404).json({ error: 'Service request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve service request' });
  }
}

export async function updateServiceRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateServiceRequestSchema.parse(req.body);
    const updatedServiceRequest = await serviceRequestService.updateServiceRequest(id, validatedData);
    if (updatedServiceRequest) {
      res.json(updatedServiceRequest);
    } else {
      res.status(404).json({ error: 'Service request not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update service request' });
    }
  }
}

export async function deleteServiceRequest(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await serviceRequestService.deleteServiceRequest(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Service request not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
