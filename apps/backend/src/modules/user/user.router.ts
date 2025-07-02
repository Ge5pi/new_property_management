import { Router } from 'express';
import * as userController from './user.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

router.get('/profile', authenticateToken, userController.getUserProfile);
router.put('/profile', authenticateToken, userController.updateUserProfile);
router.put('/password', authenticateToken, userController.updateUserPassword);

export default router;
