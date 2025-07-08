import { Request, Response } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config';
import { db } from '../../database/custom-prisma-client';
import bcrypt from 'bcryptjs';

// Измените сигнатуру (строку с объявлением функции) вот так:
export async function adminToken(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Используйте 'return', чтобы прекратить выполнение функции
      res.status(401).json({ detail: 'Invalid credentials.' });
      return;
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      res.status(401).json({ detail: 'Invalid credentials.' });
      return;
    }

    if (
      (user.isStaff || user.isSubscriptionStaff) &&
      user.associatedSubscriptionId !== null
    ) {
      const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN };
      const token = sign(
        { userId: user.id, email: user.email, isAdmin: user.isStaff },
        JWT_SECRET,
        signOptions
      );

      res.json({
        token,
        user: {
          id: user.id,
          email: user.email,
          isAdmin: user.isStaff,
        },
      });
    } else {
      res.status(403).json({ detail: 'Access denied.' });
    }
  } catch (error) {
    // В реальном приложении здесь лучше логировать ошибку
    res.status(500).json({ detail: 'Internal server error.' });
  }
}