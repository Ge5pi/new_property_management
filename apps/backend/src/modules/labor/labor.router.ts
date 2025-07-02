import { Router } from 'express';
import * as laborController from './labor.controller';

const router = Router();

router.get('/', laborController.getAllLabors);
router.post('/', laborController.createLabor);
router.get('/:id', laborController.getLaborById);
router.put('/:id', laborController.updateLabor);
router.delete('/:id', laborController.deleteLabor);

export default router;
