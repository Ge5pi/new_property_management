import { Router } from 'express';
import * as propertyLeaseTemplateAttachmentController from './property_lease_template_attachment.controller';

const router = Router();

router.get('/', propertyLeaseTemplateAttachmentController.getAllPropertyLeaseTemplateAttachments);
router.post('/', propertyLeaseTemplateAttachmentController.createPropertyLeaseTemplateAttachment);
router.get('/:id', propertyLeaseTemplateAttachmentController.getPropertyLeaseTemplateAttachmentById);
router.put('/:id', propertyLeaseTemplateAttachmentController.updatePropertyLeaseTemplateAttachment);
router.delete('/:id', propertyLeaseTemplateAttachmentController.deletePropertyLeaseTemplateAttachment);

export default router;
