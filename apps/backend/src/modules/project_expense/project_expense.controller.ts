import { Request, Response } from 'express';
import * as projectExpenseService from './project_expense.service';
import { z } from 'zod';

const createProjectExpenseSchema = z.object({
  title: z.string(),
  description: z.string(),
  amount: z.number().positive(),
  date: z.string().datetime(),
  assignedToId: z.string().uuid(),
  projectId: z.string().uuid(),
});

const updateProjectExpenseSchema = z.object({
  title: z.string().optional(),
  description: z.string().optional(),
  amount: z.number().positive().optional(),
  date: z.string().datetime().optional(),
  assignedToId: z.string().uuid().optional(),
  projectId: z.string().uuid().optional(),
});

export async function getAllProjectExpenses(req: Request, res: Response) {
  try {
    const projectExpenses = await projectExpenseService.findAllProjectExpenses();
    res.json(projectExpenses);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project expenses' });
  }
}

export async function createProjectExpense(req: Request, res: Response) {
  try {
    const validatedData = createProjectExpenseSchema.parse(req.body);
    const newProjectExpense = await projectExpenseService.createProjectExpense(validatedData);
    res.status(201).json(newProjectExpense);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create project expense' });
    }
  }
}

export async function getProjectExpenseById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projectExpense = await projectExpenseService.findProjectExpenseById(id);
    if (projectExpense) {
      res.json(projectExpense);
    } else {
      res.status(404).json({ error: 'Project expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project expense' });
  }
}

export async function updateProjectExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateProjectExpenseSchema.parse(req.body);
    const updatedProjectExpense = await projectExpenseService.updateProjectExpense(id, validatedData);
    if (updatedProjectExpense) {
      res.json(updatedProjectExpense);
    } else {
      res.status(404).json({ error: 'Project expense not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteProjectExpense(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await projectExpenseService.deleteProjectExpense(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Project expense not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
