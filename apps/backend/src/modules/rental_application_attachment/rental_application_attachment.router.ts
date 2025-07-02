import { Router } from 'express';
import * as rentalApplicationAttachmentController from './rental_application_attachment.controller';

const router = Router();

router.get('/', rentalApplicationAttachmentController.getAllRentalApplicationAttachments);
router.post('/', rentalApplicationAttachmentController.createRentalApplicationAttachment);
router.get('/:id', rentalApplicationAttachmentController.getRentalApplicationAttachmentById);
router.put('/:id', rentalApplicationAttachmentController.updateRentalApplicationAttachment);
router.delete('/:id', rentalApplicationAttachmentController.deleteRentalApplicationAttachment);

export default router;
