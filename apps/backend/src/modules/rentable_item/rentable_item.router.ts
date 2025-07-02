import { Router } from 'express';
import * as rentableItemController from './rentable_item.controller';

const router = Router();

router.get('/', rentableItemController.getAllRentableItems);
router.post('/', rentableItemController.createRentableItem);
router.get('/:id', rentableItemController.getRentableItemById);
router.put('/:id', rentableItemController.updateRentableItem);
router.delete('/:id', rentableItemController.deleteRentableItem);

export default router;
