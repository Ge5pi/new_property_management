import { Router } from 'express';
import * as purchaseOrderController from './purchase_order.controller';

const router = Router();

router.get('/', purchaseOrderController.getAllPurchaseOrders);
router.post('/', purchaseOrderController.createPurchaseOrder);
router.get('/:id', purchaseOrderController.getPurchaseOrderById);
router.put('/:id', purchaseOrderController.updatePurchaseOrder);
router.delete('/:id', purchaseOrderController.deletePurchaseOrder);

export default router;
