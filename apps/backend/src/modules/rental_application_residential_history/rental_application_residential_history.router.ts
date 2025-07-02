import { Router } from 'express';
import * as rentalApplicationResidentialHistoryController from './rental_application_residential_history.controller';

const router = Router();

router.get('/', rentalApplicationResidentialHistoryController.getAllRentalApplicationResidentialHistories);
router.post('/', rentalApplicationResidentialHistoryController.createRentalApplicationResidentialHistory);
router.get('/:id', rentalApplicationResidentialHistoryController.getRentalApplicationResidentialHistoryById);
router.put('/:id', rentalApplicationResidentialHistoryController.updateRentalApplicationResidentialHistory);
router.delete('/:id', rentalApplicationResidentialHistoryController.deleteRentalApplicationResidentialHistory);

export default router;
