import { Router } from 'express';
import * as propertyAttachmentController from './property_attachment.controller';

const router = Router();

router.get('/', propertyAttachmentController.getAllPropertyAttachments);
router.post('/', propertyAttachmentController.createPropertyAttachment);
router.get('/:id', propertyAttachmentController.getPropertyAttachmentById);
router.put('/:id', propertyAttachmentController.updatePropertyAttachment);
router.delete('/:id', propertyAttachmentController.deletePropertyAttachment);

export default router;
