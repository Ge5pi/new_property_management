import { Router } from 'express';
import * as rentalApplicationTemplateController from './rental_application_template.controller';

const router = Router();

router.get('/', rentalApplicationTemplateController.getAllRentalApplicationTemplates);
router.post('/', rentalApplicationTemplateController.createRentalApplicationTemplate);
router.get('/:id', rentalApplicationTemplateController.getRentalApplicationTemplateById);
router.put('/:id', rentalApplicationTemplateController.updateRentalApplicationTemplate);
router.delete('/:id', rentalApplicationTemplateController.deleteRentalApplicationTemplate);

export default router;
