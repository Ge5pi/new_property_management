import { Router } from 'express';
import * as rentalApplicationController from './rental_application.controller';

const router = Router();

router.get('/', rentalApplicationController.getAllRentalApplications);
router.post('/', rentalApplicationController.createRentalApplication);
router.get('/:id', rentalApplicationController.getRentalApplicationById);
router.put('/:id', rentalApplicationController.updateRentalApplication);
router.delete('/:id', rentalApplicationController.deleteRentalApplication);

export default router;
