import { Router, Request, Response, NextFunction } from 'express';
import * as accountAttachmentController from './accountAttachment.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(accountAttachmentController.getAllAccountAttachments));
router.get('/:id', asyncHandler(accountAttachmentController.getAccountAttachmentById));
router.post('/', asyncHandler(accountAttachmentController.createAccountAttachment));
router.put('/:id', asyncHandler(accountAttachmentController.updateAccountAttachment));
router.delete('/:id', asyncHandler(accountAttachmentController.deleteAccountAttachment));

export default router;
