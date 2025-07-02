import { Router } from 'express';
import * as rentalApplicationFinancialInformationController from './rental_application_financial_information.controller';

const router = Router();

router.get('/', rentalApplicationFinancialInformationController.getAllRentalApplicationFinancialInformation);
router.post('/', rentalApplicationFinancialInformationController.createRentalApplicationFinancialInformation);
router.get('/:id', rentalApplicationFinancialInformationController.getRentalApplicationFinancialInformationById);
router.put('/:id', rentalApplicationFinancialInformationController.updateRentalApplicationFinancialInformation);
router.delete('/:id', rentalApplicationFinancialInformationController.deleteRentalApplicationFinancialInformation);

export default router;
