import { Router } from 'express';
import * as rentalApplicationDependentController from './rental_application_dependent.controller';

const router = Router();

router.get('/', rentalApplicationDependentController.getAllRentalApplicationDependents);
router.post('/', rentalApplicationDependentController.createRentalApplicationDependent);
router.get('/:id', rentalApplicationDependentController.getRentalApplicationDependentById);
router.put('/:id', rentalApplicationDependentController.updateRentalApplicationDependent);
router.delete('/:id', rentalApplicationDependentController.deleteRentalApplicationDependent);

export default router;
