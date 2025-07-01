import { Router } from 'express';
import * as rentalApplicationController from './rental_application.controller';

const router = Router();

router.get('/', rentalApplicationController.getAllRentalApplications);

export default router;
