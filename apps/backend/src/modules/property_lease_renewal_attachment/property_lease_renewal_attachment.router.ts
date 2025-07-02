import { Router } from 'express';
import * as propertyLeaseRenewalAttachmentController from './property_lease_renewal_attachment.controller';

const router = Router();

router.get('/', propertyLeaseRenewalAttachmentController.getAllPropertyLeaseRenewalAttachments);
router.post('/', propertyLeaseRenewalAttachmentController.createPropertyLeaseRenewalAttachment);
router.get('/:id', propertyLeaseRenewalAttachmentController.getPropertyLeaseRenewalAttachmentById);
router.put('/:id', propertyLeaseRenewalAttachmentController.updatePropertyLeaseRenewalAttachment);
router.delete('/:id', propertyLeaseRenewalAttachmentController.deletePropertyLeaseRenewalAttachment);

export default router;
