import { Router } from 'express';
import * as unitTypeController from './unit_type.controller';

const router = Router();

router.get('/', unitTypeController.getAllUnitTypes);
router.post('/', unitTypeController.createUnitType);
router.get('/:id', unitTypeController.getUnitTypeById);
router.put('/:id', unitTypeController.updateUnitType);
router.delete('/:id', unitTypeController.deleteUnitType);

export default router;
