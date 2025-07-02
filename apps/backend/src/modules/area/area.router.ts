import { Router } from 'express';
import * as areaController from './area.controller';

const router = Router();

router.get('/', areaController.getAllAreas);
router.post('/', areaController.createArea);
router.get('/:id', areaController.getAreaById);
router.put('/:id', areaController.updateArea);
router.delete('/:id', areaController.deleteArea);

export default router;
