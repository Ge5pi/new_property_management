import { Router } from 'express';
import * as propertyLateFeePolicyController from './property_late_fee_policy.controller';

const router = Router();

router.get('/', propertyLateFeePolicyController.getAllPropertyLateFeePolicies);
router.post('/', propertyLateFeePolicyController.createPropertyLateFeePolicy);
router.get('/:id', propertyLateFeePolicyController.getPropertyLateFeePolicyById);
router.put('/:id', propertyLateFeePolicyController.updatePropertyLateFeePolicy);
router.delete('/:id', propertyLateFeePolicyController.deletePropertyLateFeePolicy);

export default router;
