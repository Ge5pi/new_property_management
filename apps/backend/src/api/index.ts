import { Router } from 'express';
import propertyRouter from '../modules/property/property.router';
import unitRouter from '../modules/unit/unit.router';
import unitTypeRouter from '../modules/unit_type/unit_type.router';
import leaseRouter from '../modules/lease/lease.router';
import rentalApplicationRouter from '../modules/rental_application/rental_application.router';
import peopleRouter from '../modules/people';

const router = Router();

router.use('/properties', propertyRouter);
router.use('/units', unitRouter);
router.use('/unit-types', unitTypeRouter);
router.use('/leases', leaseRouter);
router.use('/rental-applications', rentalApplicationRouter);
router.use('/people', peopleRouter);

export default router;
