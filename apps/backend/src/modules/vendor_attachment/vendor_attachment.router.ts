import { Router } from 'express';
import * as vendorAttachmentController from './vendor_attachment.controller';

const router = Router();

router.get('/', vendorAttachmentController.getAllVendorAttachments);
router.post('/', vendorAttachmentController.createVendorAttachment);
router.get('/:id', vendorAttachmentController.getVendorAttachmentById);
router.put('/:id', vendorAttachmentController.updateVendorAttachment);
router.delete('/:id', vendorAttachmentController.deleteVendorAttachment);

export default router;
