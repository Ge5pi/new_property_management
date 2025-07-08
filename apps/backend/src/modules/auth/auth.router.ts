import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.post('/admin-token', authController.adminToken);

export default router;