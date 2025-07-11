import { Router, Request, Response, NextFunction } from 'express';
import * as generalLedgerAccountController from './generalLedgerAccount.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(generalLedgerAccountController.getAllGeneralLedgerAccounts));
router.get('/:id', asyncHandler(generalLedgerAccountController.getGeneralLedgerAccountById));
router.post('/', asyncHandler(generalLedgerAccountController.createGeneralLedgerAccount));
router.put('/:id', asyncHandler(generalLedgerAccountController.updateGeneralLedgerAccount));
router.delete('/:id', asyncHandler(generalLedgerAccountController.deleteGeneralLedgerAccount));

export default router;
