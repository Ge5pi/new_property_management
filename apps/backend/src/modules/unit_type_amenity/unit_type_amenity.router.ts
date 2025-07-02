import { Router } from 'express';
import * as unitTypeAmenityController from './unit_type_amenity.controller';

const router = Router();

router.get('/', unitTypeAmenityController.getAllUnitTypeAmenities);
router.post('/', unitTypeAmenityController.createUnitTypeAmenity);
router.get('/:id', unitTypeAmenityController.getUnitTypeAmenityById);
router.put('/:id', unitTypeAmenityController.updateUnitTypeAmenity);
router.delete('/:id', unitTypeAmenityController.deleteUnitTypeAmenity);

export default router;
