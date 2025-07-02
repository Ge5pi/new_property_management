import { Router } from 'express';
import * as tenantController from './tenant.controller';

const router = Router();

router.get('/', tenantController.getAllTenants);
router.post('/', tenantController.createTenant);
router.get('/:id', tenantController.getTenantById);
router.put('/:id', tenantController.updateTenant);
router.delete('/:id', tenantController.deleteTenant);

export default router;
