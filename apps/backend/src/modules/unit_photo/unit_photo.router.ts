import { Router } from 'express';
import * as unitPhotoController from './unit_photo.controller';

const router = Router();

router.get('/', unitPhotoController.getAllUnitPhotos);
router.post('/', unitPhotoController.createUnitPhoto);
router.get('/:id', unitPhotoController.getUnitPhotoById);
router.put('/:id', unitPhotoController.updateUnitPhoto);
router.delete('/:id', unitPhotoController.deleteUnitPhoto);

export default router;
