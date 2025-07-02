import { Router } from 'express';
import * as vendorAddressController from './vendor_address.controller';

const router = Router();

router.get('/', vendorAddressController.getAllVendorAddresses);
router.post('/', vendorAddressController.createVendorAddress);
router.get('/:id', vendorAddressController.getVendorAddressById);
router.put('/:id', vendorAddressController.updateVendorAddress);
router.delete('/:id', vendorAddressController.deleteVendorAddress);

export default router;
