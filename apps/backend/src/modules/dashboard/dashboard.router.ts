import { Router } from 'express';
import corsMiddleware from '../../middleware/cors.middleware';
import { authenticateToken } from '../../middleware/auth.middleware';
import { getDashboardStats } from './dashboard.controller';

const router = Router();

router.get(
  '/dashboard-stats',
  corsMiddleware,
  authenticateToken,
  getDashboardStats
);

export default router;