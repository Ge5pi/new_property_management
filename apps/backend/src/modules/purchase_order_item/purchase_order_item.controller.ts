import { Request, Response } from 'express';
import * as purchaseOrderItemService from './purchase_order_item.service';
import { z } from 'zod';

const createPurchaseOrderItemSchema = z.object({
  inventoryItemId: z.string().uuid(),
  cost: z.number().positive(),
  quantity: z.number().int().positive(),
  purchaseOrderId: z.string().uuid(),
});

const updatePurchaseOrderItemSchema = z.object({
  inventoryItemId: z.string().uuid().optional(),
  cost: z.number().positive().optional(),
  quantity: z.number().int().positive().optional(),
  purchaseOrderId: z.string().uuid().optional(),
});

export async function getAllPurchaseOrderItems(req: Request, res: Response) {
  try {
    const purchaseOrderItems = await purchaseOrderItemService.findAllPurchaseOrderItems();
    res.json(purchaseOrderItems);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchase order items' });
  }
}

export async function createPurchaseOrderItem(req: Request, res: Response) {
  try {
    const validatedData = createPurchaseOrderItemSchema.parse(req.body);
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      quantity: validatedData.quantity,
      cost: validatedData.cost,
      inventory_item_id: validatedData.inventoryItemId,
      purchase_order_id: validatedData.purchaseOrderId,
    };
    const newPurchaseOrderItem = await purchaseOrderItemService.createPurchaseOrderItem(mappedData);
    res.status(201).json(newPurchaseOrderItem);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create purchase order item' });
    }
  }
}

export async function getPurchaseOrderItemById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const purchaseOrderItem = await purchaseOrderItemService.findPurchaseOrderItemById(id);
    if (purchaseOrderItem) {
      res.json(purchaseOrderItem);
    } else {
      res.status(404).json({ error: 'Purchase order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve purchase order item' });
  }
}

export async function updatePurchaseOrderItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updatePurchaseOrderItemSchema.parse(req.body);
    const updatedPurchaseOrderItem = await purchaseOrderItemService.updatePurchaseOrderItem(id, validatedData);
    if (updatedPurchaseOrderItem) {
      res.json(updatedPurchaseOrderItem);
    } else {
      res.status(404).json({ error: 'Purchase order item not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deletePurchaseOrderItem(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await purchaseOrderItemService.deletePurchaseOrderItem(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Purchase order item not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
