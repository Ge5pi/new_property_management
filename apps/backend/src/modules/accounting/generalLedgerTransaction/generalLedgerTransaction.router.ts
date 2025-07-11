import { Router, Request, Response, NextFunction } from 'express';
import * as generalLedgerTransactionController from './generalLedgerTransaction.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(generalLedgerTransactionController.getAllGeneralLedgerTransactions));
router.get('/:id', asyncHandler(generalLedgerTransactionController.getGeneralLedgerTransactionById));
router.post('/', asyncHandler(generalLedgerTransactionController.createGeneralLedgerTransaction));
router.put('/:id', asyncHandler(generalLedgerTransactionController.updateGeneralLedgerTransaction));
router.delete('/:id', asyncHandler(generalLedgerTransactionController.deleteGeneralLedgerTransaction));

export default router;
