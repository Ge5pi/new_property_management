import { Router } from 'express';
import * as unitUpcomingActivityController from './unit_upcoming_activity.controller';

const router = Router();

router.get('/', unitUpcomingActivityController.getAllUnitUpcomingActivities);
router.post('/', unitUpcomingActivityController.createUnitUpcomingActivity);
router.get('/:id', unitUpcomingActivityController.getUnitUpcomingActivityById);
router.put('/:id', unitUpcomingActivityController.updateUnitUpcomingActivity);
router.delete('/:id', unitUpcomingActivityController.deleteUnitUpcomingActivity);

export default router;
