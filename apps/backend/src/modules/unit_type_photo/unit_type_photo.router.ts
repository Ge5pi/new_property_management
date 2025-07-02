import { Router } from 'express';
import * as unitTypePhotoController from './unit_type_photo.controller';

const router = Router();

router.get('/', unitTypePhotoController.getAllUnitTypePhotos);
router.post('/', unitTypePhotoController.createUnitTypePhoto);
router.get('/:id', unitTypePhotoController.getUnitTypePhotoById);
router.put('/:id', unitTypePhotoController.updateUnitTypePhoto);
router.delete('/:id', unitTypePhotoController.deleteUnitTypePhoto);

export default router;
