import { Router, Request, Response, NextFunction } from 'express';
import * as noteController from './note.controller';
import { authenticateToken } from '../../../middleware/auth.middleware';

const router = Router();

function asyncHandler(fn: (req: Request, res: Response, next: NextFunction) => Promise<any>) {
  return function (req: Request, res: Response, next: NextFunction) {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}

router.use(authenticateToken);

router.get('/', asyncHandler(noteController.getAllNotes));
router.get('/:id', asyncHandler(noteController.getNoteById));
router.post('/', asyncHandler(noteController.createNote));
router.put('/:id', asyncHandler(noteController.updateNote));
router.delete('/:id', asyncHandler(noteController.deleteNote));

export default router;
