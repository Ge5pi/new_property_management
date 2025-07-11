import { Router, Request, Response, NextFunction } from 'express';
import * as emailTemplateController from './emailTemplate.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(emailTemplateController.getAllEmailTemplates));
router.get('/:id', asyncHandler(emailTemplateController.getEmailTemplateById));
router.post('/', asyncHandler(emailTemplateController.createEmailTemplate));
router.put('/:id', asyncHandler(emailTemplateController.updateEmailTemplate));
router.delete('/:id', asyncHandler(emailTemplateController.deleteEmailTemplate));

export default router;
