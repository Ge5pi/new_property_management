import { Router } from 'express';
import * as propertyPhotoController from './property_photo.controller';

const router = Router();

router.get('/', propertyPhotoController.getAllPropertyPhotos);
router.post('/', propertyPhotoController.createPropertyPhoto);
router.get('/:id', propertyPhotoController.getPropertyPhotoById);
router.put('/:id', propertyPhotoController.updatePropertyPhoto);
router.delete('/:id', propertyPhotoController.deletePropertyPhoto);

export default router;
