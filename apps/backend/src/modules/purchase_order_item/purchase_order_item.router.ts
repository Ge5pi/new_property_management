import { Router } from 'express';
import * as purchaseOrderItemController from './purchase_order_item.controller';

const router = Router();

router.get('/', purchaseOrderItemController.getAllPurchaseOrderItems);
router.post('/', purchaseOrderItemController.createPurchaseOrderItem);
router.get('/:id', purchaseOrderItemController.getPurchaseOrderItemById);
router.put('/:id', purchaseOrderItemController.updatePurchaseOrderItem);
router.delete('/:id', purchaseOrderItemController.deletePurchaseOrderItem);

export default router;
