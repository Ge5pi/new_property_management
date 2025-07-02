import { Router } from 'express';
import * as ownerController from './owner.controller';

const router = Router();

router.get('/', ownerController.getAllOwners);
router.post('/', ownerController.createOwner);
router.get('/:id', ownerController.getOwnerById);
router.put('/:id', ownerController.updateOwner);
router.delete('/:id', ownerController.deleteOwner);

export default router;
