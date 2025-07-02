import { Router } from 'express';
import * as leaseController from './lease.controller';

const router = Router();

router.get('/', leaseController.getAllLeases);
router.post('/', leaseController.createLease);
router.get('/:id', leaseController.getLeaseById);
router.put('/:id', leaseController.updateLease);
router.delete('/:id', leaseController.deleteLease);

export default router;
