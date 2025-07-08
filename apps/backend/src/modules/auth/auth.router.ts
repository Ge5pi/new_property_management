import { Router } from 'express';
import * as authController from './auth.controller';

const router = Router();

router.post('/admin-token', (req, res, next) => {
  authController.adminToken(req, res).catch(next);
});

export default router;
