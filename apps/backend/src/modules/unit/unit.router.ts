import { Router } from 'express';
import * as unitController from './unit.controller';

const router = Router();

router.get('/', unitController.getAllUnits);
router.post('/', unitController.createUnit);
router.get('/:id', unitController.getUnitById);
router.put('/:id', unitController.updateUnit);
router.delete('/:id', unitController.deleteUnit);

export default router;
