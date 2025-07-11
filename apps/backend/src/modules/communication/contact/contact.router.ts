import { Router, Request, Response, NextFunction } from 'express';
import * as contactController from './contact.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(contactController.getAllContacts));
router.get('/:id', asyncHandler(contactController.getContactById));
router.post('/', asyncHandler(contactController.createContact));
router.put('/:id', asyncHandler(contactController.updateContact));
router.delete('/:id', asyncHandler(contactController.deleteContact));

export default router;
