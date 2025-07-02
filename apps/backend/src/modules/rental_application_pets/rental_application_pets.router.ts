import { Router } from 'express';
import * as rentalApplicationPetsController from './rental_application_pets.controller';

const router = Router();

router.get('/', rentalApplicationPetsController.getAllRentalApplicationPets);
router.post('/', rentalApplicationPetsController.createRentalApplicationPets);
router.get('/:id', rentalApplicationPetsController.getRentalApplicationPetsById);
router.put('/:id', rentalApplicationPetsController.updateRentalApplicationPets);
router.delete('/:id', rentalApplicationPetsController.deleteRentalApplicationPets);

export default router;
