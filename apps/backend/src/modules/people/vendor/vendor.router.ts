import { Router } from 'express';
import * as vendorController from './vendor.controller';

const router = Router();

router.get('/', vendorController.getAllVendors);

export default router;
