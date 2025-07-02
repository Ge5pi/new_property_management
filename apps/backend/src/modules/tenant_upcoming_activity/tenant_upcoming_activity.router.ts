import { Router } from 'express';
import * as tenantUpcomingActivityController from './tenant_upcoming_activity.controller';

const router = Router();

router.get('/', tenantUpcomingActivityController.getAllTenantUpcomingActivities);
router.post('/', tenantUpcomingActivityController.createTenantUpcomingActivity);
router.get('/:id', tenantUpcomingActivityController.getTenantUpcomingActivityById);
router.put('/:id', tenantUpcomingActivityController.updateTenantUpcomingActivity);
router.delete('/:id', tenantUpcomingActivityController.deleteTenantUpcomingActivity);

export default router;
