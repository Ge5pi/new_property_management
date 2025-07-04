import { Request, Response } from 'express';
import * as purchaseOrderService from './purchase_order.service';
import { z } from 'zod';

const createPurchaseOrderSchema = z.object({
  vendorId: z.string().uuid().optional(),
  description: z.string(),
  requiredByDate: z.string().datetime(),
  tax: z.number().optional(),
  taxChargeType: z.enum(['PERCENT', 'FLAT']).optional(),
  shipping: z.number().optional(),
  shippingChargeType: z.enum(['PERCENT', 'FLAT']).optional(),
  discount: z.number().optional(),
  discountChargeType: z.enum(['PERCENT', 'FLAT']).optional(),
  notes: z.string().optional(),
});

const updatePurchaseOrderSchema = z.object({
  vendorId: z.string().uuid().optional(),
  description: z.string().optional(),
  requiredByDate: z.string().datetime().optional(),
  tax: z.number().optional(),
  taxChargeType: z.enum(['PERCENT', 'FLAT']).optional(),
  shipping: z.number().optional(),
  shippingChargeType: z.enum(['PERCENT', 'FLAT']).optional(),
  discount: z.number().optional(),
  discountChargeType: z.enum(['PERCENT', 'FLAT']).optional(),
  notes: z.string().optional(),
});

export async function getAllPurchaseOrders(req: Request, res: Response) {
  try {
    const purchaseOrders = await purchaseOrderService.findAllPurchaseOrders();
    res.json(purchaseOrders);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchase orders' });
  }
}

export async function createPurchaseOrder(req: Request, res: Response) {
  try {
    const validatedData = createPurchaseOrderSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      description: validatedData.description,
      required_by_date: validatedData.requiredByDate,
      notes: validatedData.notes,
      vendor_id: validatedData.vendorId,
      tax: validatedData.tax,
      tax_charge_type: validatedData.taxChargeType,
      shipping: validatedData.shipping,
      shipping_charge_type: validatedData.shippingChargeType,
      discount: validatedData.discount,
      discount_charge_type: validatedData.discountChargeType,
    };
    const newPurchaseOrder = await purchaseOrderService.createPurchaseOrder(mappedData);
    res.status(201).json(newPurchaseOrder);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create purchase order' });
    }
  }
}

export async function getPurchaseOrderById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const purchaseOrder = await purchaseOrderService.findPurchaseOrderById(id);
    if (purchaseOrder) {
      res.json(purchaseOrder);
    } else {
      res.status(404).json({ error: 'Purchase order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchase order' });
  }
}

export async function updatePurchaseOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePurchaseOrderSchema.parse(req.body);
    const updatedPurchaseOrder = await purchaseOrderService.updatePurchaseOrder(id, validatedData);
    if (updatedPurchaseOrder) {
      res.json(updatedPurchaseOrder);
    } else {
      res.status(404).json({ error: 'Purchase order not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deletePurchaseOrder(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await purchaseOrderService.deletePurchaseOrder(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Purchase order not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
