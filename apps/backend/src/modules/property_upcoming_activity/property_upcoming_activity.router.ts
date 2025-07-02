import { Router } from 'express';
import * as propertyUpcomingActivityController from './property_upcoming_activity.controller';

const router = Router();

router.get('/', propertyUpcomingActivityController.getAllPropertyUpcomingActivities);
router.post('/', propertyUpcomingActivityController.createPropertyUpcomingActivity);
router.get('/:id', propertyUpcomingActivityController.getPropertyUpcomingActivityById);
router.put('/:id', propertyUpcomingActivityController.updatePropertyUpcomingActivity);
router.delete('/:id', propertyUpcomingActivityController.deletePropertyUpcomingActivity);

export default router;
