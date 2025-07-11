import { Router, Request, Response, NextFunction } from 'express';
import * as paymentController from './payment.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(paymentController.getAllPayments));
router.get('/:id', asyncHandler(paymentController.getPaymentById));
router.post('/', asyncHandler(paymentController.createPayment));
router.put('/:id', asyncHandler(paymentController.updatePayment));
router.delete('/:id', asyncHandler(paymentController.deletePayment));

export default router;
