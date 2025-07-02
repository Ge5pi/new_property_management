import { Request, Response } from 'express';
import * as projectService from './project.service';
import { z } from 'zod';

const createProjectSchema = z.object({
  name: z.string(),
  description: z.string(),
  status: z.enum(['OPEN', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED', 'PENDING', 'IN_PROGRESS']).default('PENDING'),
  parentPropertyId: z.string().uuid(),
  selectAllUnits: z.boolean(),
  budget: z.number().positive(),
  glAccount: z.string(),
  startDate: z.string().datetime(),
  endDate: z.string().datetime().optional(),
});

const updateProjectSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  status: z.enum(['OPEN', 'ASSIGNED', 'UNASSIGNED', 'COMPLETED', 'PENDING', 'IN_PROGRESS']).optional(),
  parentPropertyId: z.string().uuid().optional(),
  selectAllUnits: z.boolean().optional(),
  budget: z.number().positive().optional(),
  glAccount: z.string().optional(),
  startDate: z.string().datetime().optional(),
  endDate: z.string().datetime().optional(),
});

export async function getAllProjects(req: Request, res: Response) {
  try {
    const projects = await projectService.findAllProjects();
    res.json(projects);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve projects' });
  }
}

export async function createProject(req: Request, res: Response) {
  try {
    const validatedData = createProjectSchema.parse(req.body);
    const newProject = await projectService.createProject(validatedData);
    res.status(201).json(newProject);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create project' });
    }
  }
}

export async function getProjectById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const project = await projectService.findProjectById(id);
    if (project) {
      res.json(project);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve project' });
  }
}

export async function updateProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateProjectSchema.parse(req.body);
    const updatedProject = await projectService.updateProject(id, validatedData);
    if (updatedProject) {
      res.json(updatedProject);
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update project' });
    }
  }
}

export async function deleteProject(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await projectService.deleteProject(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Project not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
