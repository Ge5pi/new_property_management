import { Router } from 'express';
import * as rentalApplicationEmergencyContactController from './rental_application_emergency_contact.controller';

const router = Router();

router.get('/', rentalApplicationEmergencyContactController.getAllRentalApplicationEmergencyContacts);
router.post('/', rentalApplicationEmergencyContactController.createRentalApplicationEmergencyContact);
router.get('/:id', rentalApplicationEmergencyContactController.getRentalApplicationEmergencyContactById);
router.put('/:id', rentalApplicationEmergencyContactController.updateRentalApplicationEmergencyContact);
router.delete('/:id', rentalApplicationEmergencyContactController.deleteRentalApplicationEmergencyContact);

export default router;
