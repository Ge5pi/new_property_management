import { Router } from 'express';
import * as applicantController from './applicant.controller';

const router = Router();

router.get('/', applicantController.getAllApplicants);
router.post('/', applicantController.createApplicant);
router.get('/:id', applicantController.getApplicantById);
router.put('/:id', applicantController.updateApplicant);
router.delete('/:id', applicantController.deleteApplicant);

export default router;
