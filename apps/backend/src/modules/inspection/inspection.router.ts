import { Router } from 'express';
import * as inspectionController from './inspection.controller';

const router = Router();

router.get('/', inspectionController.getAllInspections);
router.post('/', inspectionController.createInspection);
router.get('/:id', inspectionController.getInspectionById);
router.put('/:id', inspectionController.updateInspection);
router.delete('/:id', inspectionController.deleteInspection);

export default router;
