import { Router, Request, Response, NextFunction } from 'express';
import * as chargeAttachmentController from './chargeAttachment.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(chargeAttachmentController.getAllChargeAttachments));
router.get('/:id', asyncHandler(chargeAttachmentController.getChargeAttachmentById));
router.post('/', asyncHandler(chargeAttachmentController.createChargeAttachment));
router.put('/:id', asyncHandler(chargeAttachmentController.updateChargeAttachment));
router.delete('/:id', asyncHandler(chargeAttachmentController.deleteChargeAttachment));

export default router;
