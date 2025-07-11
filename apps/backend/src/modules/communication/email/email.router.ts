import { Router, Request, Response, NextFunction } from 'express';
import * as emailController from './email.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(emailController.getAllEmails));
router.get('/:id', asyncHandler(emailController.getEmailById));
router.post('/', asyncHandler(emailController.createEmail));
router.put('/:id', asyncHandler(emailController.updateEmail));
router.delete('/:id', asyncHandler(emailController.deleteEmail));

export default router;
