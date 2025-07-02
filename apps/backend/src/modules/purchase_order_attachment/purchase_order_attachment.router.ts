import { Router } from 'express';
import * as purchaseOrderAttachmentController from './purchase_order_attachment.controller';

const router = Router();

router.get('/', purchaseOrderAttachmentController.getAllPurchaseOrderAttachments);
router.post('/', purchaseOrderAttachmentController.createPurchaseOrderAttachment);
router.get('/:id', purchaseOrderAttachmentController.getPurchaseOrderAttachmentById);
router.put('/:id', purchaseOrderAttachmentController.updatePurchaseOrderAttachment);
router.delete('/:id', purchaseOrderAttachmentController.deletePurchaseOrderAttachment);

export default router;
