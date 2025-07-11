import { Router, Request, Response, NextFunction } from 'express';
import * as announcementController from './announcement.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(announcementController.getAllAnnouncements));
router.get('/:id', asyncHandler(announcementController.getAnnouncementById));
router.post('/', asyncHandler(announcementController.createAnnouncement));
router.put('/:id', asyncHandler(announcementController.updateAnnouncement));
router.delete('/:id', asyncHandler(announcementController.deleteAnnouncement));

export default router;
