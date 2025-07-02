import { Router } from 'express';
import * as secondaryTenantController from './secondary_tenant.controller';

const router = Router();

router.get('/', secondaryTenantController.getAllSecondaryTenants);
router.post('/', secondaryTenantController.createSecondaryTenant);
router.get('/:id', secondaryTenantController.getSecondaryTenantById);
router.put('/:id', secondaryTenantController.updateSecondaryTenant);
router.delete('/:id', secondaryTenantController.deleteSecondaryTenant);

export default router;
