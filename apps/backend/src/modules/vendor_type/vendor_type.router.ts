import { Router } from 'express';
import * as vendorTypeController from './vendor_type.controller';

const router = Router();

router.get('/', vendorTypeController.getAllVendorTypes);
router.post('/', vendorTypeController.createVendorType);
router.get('/:id', vendorTypeController.getVendorTypeById);
router.put('/:id', vendorTypeController.updateVendorType);
router.delete('/:id', vendorTypeController.deleteVendorType);

export default router;
