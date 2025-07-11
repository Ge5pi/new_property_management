import { Router, Request, Response, NextFunction } from 'express';
import * as announcementAttachmentController from './announcementAttachment.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(announcementAttachmentController.getAllAnnouncementAttachments));
router.get('/:id', asyncHandler(announcementAttachmentController.getAnnouncementAttachmentById));
router.post('/', asyncHandler(announcementAttachmentController.createAnnouncementAttachment));
router.put('/:id', asyncHandler(announcementAttachmentController.updateAnnouncementAttachment));
router.delete('/:id', asyncHandler(announcementAttachmentController.deleteAnnouncementAttachment));

export default router;
