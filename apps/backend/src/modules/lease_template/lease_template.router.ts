import { Router } from 'express';
import * as leaseTemplateController from './lease_template.controller';

const router = Router();

router.get('/', leaseTemplateController.getAllLeaseTemplates);
router.post('/', leaseTemplateController.createLeaseTemplate);
router.get('/:id', leaseTemplateController.getLeaseTemplateById);
router.put('/:id', leaseTemplateController.updateLeaseTemplate);
router.delete('/:id', leaseTemplateController.deleteLeaseTemplate);

export default router;
