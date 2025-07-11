import { Router, Request, Response, NextFunction } from 'express';
import * as groupController from './group.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(groupController.getAllGroups));
router.get('/:id', asyncHandler(groupController.getGroupById));
router.post('/', asyncHandler(groupController.createGroup));
router.put('/:id', asyncHandler(groupController.updateGroup));
router.delete('/:id', asyncHandler(groupController.deleteGroup));

export default router;
