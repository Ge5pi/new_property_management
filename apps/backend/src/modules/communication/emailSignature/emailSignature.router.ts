import { Router, Request, Response, NextFunction } from 'express';
import * as emailSignatureController from './emailSignature.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(emailSignatureController.getAllEmailSignatures));
router.get('/:id', asyncHandler(emailSignatureController.getEmailSignatureById));
router.post('/', asyncHandler(emailSignatureController.createEmailSignature));
router.put('/:id', asyncHandler(emailSignatureController.updateEmailSignature));
router.delete('/:id', asyncHandler(emailSignatureController.deleteEmailSignature));

export default router;
