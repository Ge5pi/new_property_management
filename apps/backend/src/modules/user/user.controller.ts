import { Request, Response } from 'express';
import * as userService from '../../services/user.service';
import { z } from 'zod';

interface AuthenticatedRequest extends Request {
  userId?: string;
}

const updateUserProfileSchema = z.object({
  firstName: z.string().optional(),
  lastName: z.string().optional(),
  email: z.string().email().optional(),
});

const updatePasswordSchema = z.object({
  oldPassword: z.string(),
  newPassword: z.string().min(6),
});

export async function getUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }
    // Exclude sensitive information like password
    const { password, ...profile } = user;
    res.json(profile);
  } catch (error) {
    res.status(500).json({ error: 'Failed to retrieve user profile' });
  }
}

export async function updateUserProfile(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const validatedData = updateUserProfileSchema.parse(req.body);
    const updatedUser = await userService.updateUser(userId, validatedData);
    if (!updatedUser) {
      return res.status(404).json({ error: 'User not found' });
    }
    const { password, ...profile } = updatedUser;
    res.json(profile);
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}

export async function updateUserPassword(req: AuthenticatedRequest, res: Response) {
  try {
    const userId = req.userId;
    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized' });
    }
    const { oldPassword, newPassword } = updatePasswordSchema.parse(req.body);

    const user = await userService.findUserById(userId);
    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ error: 'Invalid old password' });
    }

    await userService.updatePassword(userId, newPassword);
    res.status(200).json({ message: 'Password updated successfully' });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({ errors: error.errors });
    } else {
      res.status(500).json({ error: (error as Error).message });
    }
  }
}
