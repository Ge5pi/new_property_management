import { Router } from 'express';
import * as ownerUpcomingActivityController from './owner_upcoming_activity.controller';

const router = Router();

router.get('/', ownerUpcomingActivityController.getAllOwnerUpcomingActivities);
router.post('/', ownerUpcomingActivityController.createOwnerUpcomingActivity);
router.get('/:id', ownerUpcomingActivityController.getOwnerUpcomingActivityById);
router.put('/:id', ownerUpcomingActivityController.updateOwnerUpcomingActivity);
router.delete('/:id', ownerUpcomingActivityController.deleteOwnerUpcomingActivity);

export default router;
