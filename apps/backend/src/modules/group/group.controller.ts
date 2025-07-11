import { Request, Response } from 'express';
import * as groupService from './group.service';

export async function getAllGroups(req: Request, res: Response): Promise<void> {
  try {
    const groups = await groupService.getAllGroups();
    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get groups' });
  }
}

export async function getGroupById(req: Request, res: Response): Promise<void> {
  try {
    const group = await groupService.getGroupById(req.params.id);
    if (!group) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
    res.json(group);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get group' });
  }
}

export async function createGroup(req: Request, res: Response): Promise<void> {
  try {
    const newGroup = await groupService.createGroup(req.body);
    res.status(201).json(newGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create group' });
  }
}

export async function updateGroup(req: Request, res: Response): Promise<void> {
  try {
    const updatedGroup = await groupService.updateGroup(req.params.id, req.body);
    if (!updatedGroup) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
    res.json(updatedGroup);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update group' });
  }
}

export async function deleteGroup(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await groupService.deleteGroup(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'Group not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete group' });
  }
}
