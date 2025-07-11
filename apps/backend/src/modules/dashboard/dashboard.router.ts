import { Router } from 'express';
import corsMiddleware from '../../middleware/cors.middleware'; 
import { getDashboardStats } from './dashboard.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

import { getGeneralStats } from './dashboard.controller';

router.get(
  '/dashboard-stats',
  corsMiddleware,
  authenticateToken,
  getDashboardStats 
);

router.get(
  '/general-stats',
  corsMiddleware,
  authenticateToken,
  getGeneralStats
);

export default router;