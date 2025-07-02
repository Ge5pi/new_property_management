import { Router } from 'express';
import * as workOrderController from './work_order.controller';

const router = Router();

router.get('/', workOrderController.getAllWorkOrders);
router.post('/', workOrderController.createWorkOrder);
router.get('/:id', workOrderController.getWorkOrderById);
router.put('/:id', workOrderController.updateWorkOrder);
router.delete('/:id', workOrderController.deleteWorkOrder);

export default router;
