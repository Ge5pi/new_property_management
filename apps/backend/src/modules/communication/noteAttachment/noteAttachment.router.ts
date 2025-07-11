import { Router, Request, Response, NextFunction } from 'express';
import * as noteAttachmentController from './noteAttachment.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(noteAttachmentController.getAllNoteAttachments));
router.get('/:id', asyncHandler(noteAttachmentController.getNoteAttachmentById));
router.post('/', asyncHandler(noteAttachmentController.createNoteAttachment));
router.put('/:id', asyncHandler(noteAttachmentController.updateNoteAttachment));
router.delete('/:id', asyncHandler(noteAttachmentController.deleteNoteAttachment));

export default router;
