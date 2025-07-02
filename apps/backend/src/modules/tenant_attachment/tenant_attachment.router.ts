import { Router } from 'express';
import * as tenantAttachmentController from './tenant_attachment.controller';

const router = Router();

router.get('/', tenantAttachmentController.getAllTenantAttachments);
router.post('/', tenantAttachmentController.createTenantAttachment);
router.get('/:id', tenantAttachmentController.getTenantAttachmentById);
router.put('/:id', tenantAttachmentController.updateTenantAttachment);
router.delete('/:id', tenantAttachmentController.deleteTenantAttachment);

export default router;
