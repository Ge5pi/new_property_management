import { Router } from 'express';
import * as tenantController from './tenant.controller';

const router = Router();

router.get('/', tenantController.getAllTenants);

export default router;
