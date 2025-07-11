import { Router, Request, Response, NextFunction } from 'express';
import * as paymentAttachmentController from './paymentAttachment.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(paymentAttachmentController.getAllPaymentAttachments));
router.get('/:id', asyncHandler(paymentAttachmentController.getPaymentAttachmentById));
router.post('/', asyncHandler(paymentAttachmentController.createPaymentAttachment));
router.put('/:id', asyncHandler(paymentAttachmentController.updatePaymentAttachment));
router.delete('/:id', asyncHandler(paymentAttachmentController.deletePaymentAttachment));

export default router;
