import { Router, Request, Response, NextFunction } from 'express';
import * as chargeController from './charge.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(chargeController.getAllCharges));
router.get('/:id', asyncHandler(chargeController.getChargeById));
router.post('/', asyncHandler(chargeController.createCharge));
router.put('/:id', asyncHandler(chargeController.updateCharge));
router.delete('/:id', asyncHandler(chargeController.deleteCharge));

export default router;
