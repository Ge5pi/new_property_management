import { Request, Response } from 'express';
import * as leaseTemplateService from './lease_template.service';
import { z } from 'zod';

const createLeaseTemplateSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  rulesAndPolicies: z.array(z.string()).optional(),
  conditionOfPremises: z.array(z.string()).optional(),
  rightOfInspection: z.boolean().default(true),
  conditionsOfMovingOut: z.array(z.string()).optional(),
  releasingPolicies: z.array(z.string()).optional(),
  finalStatement: z.string().optional(),
});

const updateLeaseTemplateSchema = z.object({
  name: z.string().optional(),
  description: z.string().optional(),
  rulesAndPolicies: z.array(z.string()).optional(),
  conditionOfPremises: z.array(z.string()).optional(),
  rightOfInspection: z.boolean().optional(),
  conditionsOfMovingOut: z.array(z.string()).optional(),
  releasingPolicies: z.array(z.string()).optional(),
  finalStatement: z.string().optional(),
});

export async function getAllLeaseTemplates(req: Request, res: Response) {
  try {
    const leaseTemplates = await leaseTemplateService.findAllLeaseTemplates();
    res.json(leaseTemplates);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lease templates' });
  }
}

export async function createLeaseTemplate(req: Request, res: Response) {
  try {
    const validatedData = createLeaseTemplateSchema.parse(req.body);
    // Map camelCase keys to snake_case keys and add missing required fields
    const mappedData = {
      id: '', // TODO: generate or assign id
      updatedAt: new Date(),
      name: validatedData.name,
      right_of_inspection: validatedData.rightOfInspection,
      description: validatedData.description,
      rules_and_policies: validatedData.rulesAndPolicies,
      condition_of_premises: validatedData.conditionOfPremises,
      conditions_of_moving_out: validatedData.conditionsOfMovingOut,
      releasing_policies: validatedData.releasingPolicies,
      final_statement: validatedData.finalStatement,
    };
    const newLeaseTemplate = await leaseTemplateService.createLeaseTemplate(mappedData);
    res.status(201).json(newLeaseTemplate);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to create lease template' });
    }
  }
}

export async function getLeaseTemplateById(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const leaseTemplate = await leaseTemplateService.findLeaseTemplateById(id);
    if (leaseTemplate) {
      res.json(leaseTemplate);
    } else {
      res.status(404).json({ error: 'Lease template not found' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve lease template' });
  }
}

export async function updateLeaseTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const validatedData = updateLeaseTemplateSchema.parse(req.body);
    const updatedLeaseTemplate = await leaseTemplateService.updateLeaseTemplate(id, validatedData);
    if (updatedLeaseTemplate) {
      res.json(updatedLeaseTemplate);
    } else {
      res.status(404).json({ error: 'Lease template not found' });
    }
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: 'Failed to update lease template' });
    }
  }
}

export async function deleteLeaseTemplate(req: Request, res: Response) {
  try {
    const { id } = req.params;
    const deleted = await leaseTemplateService.deleteLeaseTemplate(id);
    if (deleted) {
      res.status(204).send();
    } else {
      res.status(404).json({ error: 'Lease template not found' });
    }
  } catch (error) {
    res.status(500).json({ error: (error as Error).message });
  }
}
