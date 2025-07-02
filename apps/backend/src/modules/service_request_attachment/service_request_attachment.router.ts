import { Router } from 'express';
import * as serviceRequestAttachmentController from './service_request_attachment.controller';

const router = Router();

router.get('/', serviceRequestAttachmentController.getAllServiceRequestAttachments);
router.post('/', serviceRequestAttachmentController.createServiceRequestAttachment);
router.get('/:id', serviceRequestAttachmentController.getServiceRequestAttachmentById);
router.put('/:id', serviceRequestAttachmentController.updateServiceRequestAttachment);
router.delete('/:id', serviceRequestAttachmentController.deleteServiceRequestAttachment);

export default router;
