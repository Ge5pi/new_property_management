import { Router } from 'express';
import * as projectExpenseAttachmentController from './project_expense_attachment.controller';

const router = Router();

router.get('/', projectExpenseAttachmentController.getAllProjectExpenseAttachments);
router.post('/', projectExpenseAttachmentController.createProjectExpenseAttachment);
router.get('/:id', projectExpenseAttachmentController.getProjectExpenseAttachmentById);
router.put('/:id', projectExpenseAttachmentController.updateProjectExpenseAttachment);
router.delete('/:id', projectExpenseAttachmentController.deleteProjectExpenseAttachment);

export default router;
