import { Router } from 'express';
import * as serviceRequestController from './service_request.controller';

const router = Router();

router.get('/', serviceRequestController.getAllServiceRequests);
router.post('/', serviceRequestController.createServiceRequest);
router.get('/:id', serviceRequestController.getServiceRequestById);
router.put('/:id', serviceRequestController.updateServiceRequest);
router.delete('/:id', serviceRequestController.deleteServiceRequest);

export default router;
