import { Request, Response } from 'express';
import * as workOrderService from './work_order.service';
import { z } from 'zod';

const createWorkOrderSchema = z.object({
  isRecurring: z.boolean().default(false),
  cycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SIX_MONTHS']).optional(),
  status: z.enum(['OPEN', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED', 'PENDING', 'IN_PROGRESS']).default('OPEN'),
  orderType: z.enum(['INTERNAL', 'RESIDENT', 'UNIT_TURN']),
  jobDescription: z.string().optional(),
  vendorInstructions: z.string().optional(),
  vendorTrade: z.string().optional(),
  vendorTypeId: z.string().uuid(),
  vendorId: z.string().uuid(),
  emailVendor: z.boolean(),
  requestReceipt: z.boolean(),
  assignToId: z.string().uuid().optional(),
  ownerApproved: z.boolean(),
  followUpDate: z.string().datetime(),
  serviceRequestId: z.string().uuid(),
});

const updateWorkOrderSchema = z.object({
  isRecurring: z.boolean().optional(),
  cycle: z.enum(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY', 'SIX_MONTHS']).optional(),
  status: z.enum(['OPEN', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED', 'PENDING', 'IN_PROGRESS']).optional(),
  orderType: z.enum(['INTERNAL', 'RESIDENT', 'UNIT_TURN']).optional(),
  jobDescription: z.string().optional(),
  vendorInstructions: z.string().optional(),
  vendorTrade: z.string().optional(),
  vendorTypeId: z.string().uuid().optional(),
  vendorId: z.string().uuid().optional(),
  emailVendor: z.boolean().optional(),
  requestReceipt: z.boolean().optional(),
  assignToId: z.string().uuid().optional(),
  ownerApproved: z.boolean().optional(),
  followUpDate: z.string().datetime().optional(),
  serviceRequestId: z.string().uuid().optional(),
});

export async function getAllWorkOrders(req: Request, res: Response) {
  try {
    const workOrders = await workOrderService.findAllWorkOrders();
    res.json(workOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve work orders' });
  }
}

export async function createWorkOrder(req: Request, res: Response) {
  try {
    const validatedData = createWorkOrderSchema.parse(req.body);
    const newWorkOrder = await workOrderService.createWorkOrder(validatedData);
    res.status(201).json(newWorkOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create work order' });
    }
  }
}

export async function getWorkOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const workOrder = await workOrderService.findWorkOrderById(id);
    if (workOrder) {
      res.json(workOrder);
    } else {
      res.status(404).json({ error: 'Work order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve work order' });
  }
}

export async function updateWorkOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateWorkOrderSchema.parse(req.body);
    const updatedWorkOrder = await workOrderService.updateWorkOrder(id, validatedData);
    if (updatedWorkOrder) {
      res.json(updatedWorkOrder);
    } else {
      res.status(404).json({ error: 'Work order not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update work order' });
    }
  }
}

export async function deleteWorkOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await workOrderService.deleteWorkOrder(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Work order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
