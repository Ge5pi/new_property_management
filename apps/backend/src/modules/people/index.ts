import { Router } from 'express';
import tenantRouter from './tenant/tenant.router';
import vendorRouter from './vendor/vendor.router';
import ownerRouter from './owner/owner.router';

const router = Router();

router.use('/tenants', tenantRouter);
router.use('/vendors', vendorRouter);
router.use('/owners', ownerRouter);

export default router;
