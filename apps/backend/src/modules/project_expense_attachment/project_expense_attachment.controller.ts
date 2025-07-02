import { Request, Response } from 'express';
import * as projectExpenseAttachmentService from './project_expense_attachment.service';
import { z } from 'zod';

const createProjectExpenseAttachmentSchema = z.object({
  name: z.string(),
  file: z.string(),
  projectExpenseId: z.string().uuid(),
});

const updateProjectExpenseAttachmentSchema = z.object({
  name: z.string().optional(),
  file: z.string().optional(),
  projectExpenseId: z.string().uuid().optional(),
});

export async function getAllProjectExpenseAttachments(req: Request, res: Response) {
  try {
    const projectExpenseAttachments = await projectExpenseAttachmentService.findAllProjectExpenseAttachments();
    res.json(projectExpenseAttachments);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project expense attachments' });
  }
}

export async function createProjectExpenseAttachment(req: Request, res: Response) {
  try {
    const validatedData = createProjectExpenseAttachmentSchema.parse(req.body);
    const newProjectExpenseAttachment = await projectExpenseAttachmentService.createProjectExpenseAttachment(validatedData);
    res.status(201).json(newProjectExpenseAttachment);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create project expense attachment' });
    }
  }
}

export async function getProjectExpenseAttachmentById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const projectExpenseAttachment = await projectExpenseAttachmentService.findProjectExpenseAttachmentById(id);
    if (projectExpenseAttachment) {
      res.json(projectExpenseAttachment);
    } else {
      res.status(404).json({ error: 'Project expense attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project expense attachment' });
  }
}

export async function updateProjectExpenseAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateProjectExpenseAttachmentSchema.parse(req.body);
    const updatedProjectExpenseAttachment = await projectExpenseAttachmentService.updateProjectExpenseAttachment(id, validatedData);
    if (updatedProjectExpenseAttachment) {
      res.json(updatedProjectExpenseAttachment);
    } else {
      res.status(404).json({ error: 'Project expense attachment not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function deleteProjectExpenseAttachment(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await projectExpenseAttachmentService.deleteProjectExpenseAttachment(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Project expense attachment not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
