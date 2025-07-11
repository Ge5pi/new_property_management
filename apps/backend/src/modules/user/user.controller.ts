import { Request, Response } from 'express';
import * as userService from './user.service';

export async function getAllUsers(req: Request, res: Response): Promise<void> {
  try {
    const users = await userService.getAllUsers();
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get users' });
  }
}

export async function getUserById(req: Request, res: Response): Promise<void> {
  try {
    const user = await userService.getUserById(req.params.id);
    if (!user) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to get user' });
  }
}

export async function createUser(req: Request, res: Response): Promise<void> {
  try {
    const newUser = await userService.createUser(req.body);
    res.status(201).json(newUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to create user' });
  }
}

export async function updateUser(req: Request, res: Response): Promise<void> {
  try {
    const updatedUser = await userService.updateUser(req.params.id, req.body);
    if (!updatedUser) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.json(updatedUser);
  } catch (error) {
    res.status(500).json({ message: 'Failed to update user' });
  }
}

export async function deleteUser(req: Request, res: Response): Promise<void> {
  try {
    const deleted = await userService.deleteUser(req.params.id);
    if (!deleted) {
      res.status(404).json({ message: 'User not found' });
      return;
    }
    res.status(204).send();
  } catch (error) {
    res.status(500).json({ message: 'Failed to delete user' });
  }
}
