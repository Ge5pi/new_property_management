import { Router } from 'express';
import * as propertyController from './property.controller';

const router = Router();

router.get('/', propertyController.getAllProperties);
router.post('/', propertyController.createProperty);
router.get('/:id', propertyController.getPropertyById);
router.put('/:id', propertyController.updateProperty);
router.delete('/:id', propertyController.deleteProperty);

export default router;
