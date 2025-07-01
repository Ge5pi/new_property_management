import { Router } from 'express';
import * as leaseController from './lease.controller';

const router = Router();

router.get('/', leaseController.getAllLeases);

export default router;
