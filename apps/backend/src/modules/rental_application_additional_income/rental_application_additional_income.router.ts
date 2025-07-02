import { Router } from 'express';
import * as rentalApplicationAdditionalIncomeController from './rental_application_additional_income.controller';

const router = Router();

router.get('/', rentalApplicationAdditionalIncomeController.getAllRentalApplicationAdditionalIncome);
router.post('/', rentalApplicationAdditionalIncomeController.createRentalApplicationAdditionalIncome);
router.get('/:id', rentalApplicationAdditionalIncomeController.getRentalApplicationAdditionalIncomeById);
router.put('/:id', rentalApplicationAdditionalIncomeController.updateRentalApplicationAdditionalIncome);
router.delete('/:id', rentalApplicationAdditionalIncomeController.deleteRentalApplicationAdditionalIncome);

export default router;
