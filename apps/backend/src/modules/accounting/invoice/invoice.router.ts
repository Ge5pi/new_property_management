import { Router, Request, Response, NextFunction } from 'express';
import * as invoiceController from './invoice.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(invoiceController.getAllInvoices));
router.get('/:id', asyncHandler(invoiceController.getInvoiceById));
router.post('/', asyncHandler(invoiceController.createInvoice));
router.put('/:id', asyncHandler(invoiceController.updateInvoice));
router.delete('/:id', asyncHandler(invoiceController.deleteInvoice));

export default router;
