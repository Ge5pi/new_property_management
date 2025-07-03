import { Router, Request, Response, NextFunction } from 'express';
import * as userController from './user.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.get('/profile', authenticateToken, asyncHandler(userController.getUserProfile));
router.put('/profile', authenticateToken, asyncHandler(userController.updateUserProfile));
router.put('/password', authenticateToken, asyncHandler(userController.updateUserPassword));

export default router;
