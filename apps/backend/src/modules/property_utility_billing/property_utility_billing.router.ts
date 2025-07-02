import { Router } from 'express';
import * as propertyUtilityBillingController from './property_utility_billing.controller';

const router = Router();

router.get('/', propertyUtilityBillingController.getAllPropertyUtilityBillings);
router.post('/', propertyUtilityBillingController.createPropertyUtilityBilling);
router.get('/:id', propertyUtilityBillingController.getPropertyUtilityBillingById);
router.put('/:id', propertyUtilityBillingController.updatePropertyUtilityBilling);
router.delete('/:id', propertyUtilityBillingController.deletePropertyUtilityBilling);

export default router;
