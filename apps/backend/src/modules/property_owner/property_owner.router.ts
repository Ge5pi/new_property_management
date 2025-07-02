import { Router } from 'express';
import * as propertyOwnerController from './property_owner.controller';

const router = Router();

router.get('/', propertyOwnerController.getAllPropertyOwners);
router.post('/', propertyOwnerController.createPropertyOwner);
router.get('/:id', propertyOwnerController.getPropertyOwnerById);
router.put('/:id', propertyOwnerController.updatePropertyOwner);
router.delete('/:id', propertyOwnerController.deletePropertyOwner);

export default router;
