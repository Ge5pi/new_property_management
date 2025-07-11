import { Router, Request, Response, NextFunction } from 'express';
import * as accountController from './account.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(accountController.getAllAccounts));
router.get('/:id', asyncHandler(accountController.getAccountById));
router.post('/', asyncHandler(accountController.createAccount));
router.put('/:id', asyncHandler(accountController.updateAccount));
router.delete('/:id', asyncHandler(accountController.deleteAccount));

export default router;
