import { Router } from 'express';
import * as projectExpenseController from './project_expense.controller';

const router = Router();

router.get('/', projectExpenseController.getAllProjectExpenses);
router.post('/', projectExpenseController.createProjectExpense);
router.get('/:id', projectExpenseController.getProjectExpenseById);
router.put('/:id', projectExpenseController.updateProjectExpense);
router.delete('/:id', projectExpenseController.deleteProjectExpense);

export default router;
