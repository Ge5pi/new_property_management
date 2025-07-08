import { Router } from 'express';
import corsMiddleware from '../../middleware/cors.middleware'; 
import { getDashboardStats } from './dashboard.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get(
  '/dashboard-stats',
  corsMiddleware,
  authenticateToken,
  getDashboardStats 
);

export default router;