import { Router } from 'express';
import * as areaItemController from './area_item.controller';

const router = Router();

router.get('/', areaItemController.getAllAreaItems);
router.post('/', areaItemController.createAreaItem);
router.get('/:id', areaItemController.getAreaItemById);
router.put('/:id', areaItemController.updateAreaItem);
router.delete('/:id', areaItemController.deleteAreaItem);

export default router;
