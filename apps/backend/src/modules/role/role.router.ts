import { Router, Request, Response, NextFunction } from 'express';
import * as roleController from './role.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(roleController.getAllRoles));
router.get('/:id', asyncHandler(roleController.getRoleById));
router.post('/', asyncHandler(roleController.createRole));
router.put('/:id', asyncHandler(roleController.updateRole));
router.delete('/:id', asyncHandler(roleController.deleteRole));

export default router;
