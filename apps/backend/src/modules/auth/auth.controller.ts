import { Request, Response } from 'express';
import { sign } from 'jsonwebtoken';
import { db } from '../../database/custom-prisma-client';
import bcrypt from 'bcryptjs';

const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const JWT_EXPIRES_IN = '1h';

export async function adminToken(req: Request, res: Response) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ detail: 'Email and password are required.' });
  }

  try {
    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).json({ detail: 'Invalid credentials.' });
    }

    const passwordValid = await bcrypt.compare(password, user.passwordHash);
    if (!passwordValid) {
      return res.status(401).json({ detail: 'Invalid credentials.' });
    }

    // Check if user is admin or subscription staff and has associated subscription
    if (
      (user.isAdmin || user.isSubscriptionStaff) &&
      user.associatedSubscriptionId !== null
    ) {
      const token = sign(
        { userId: user.id, email: user.email, isAdmin: user.isAdmin },
        JWT_SECRET,
        { expiresIn: JWT_EXPIRES_IN }
      );

      return res.json({
        accessToken: token,
        tokenType: 'Bearer',
        expiresIn: JWT_EXPIRES_IN,
        isAdmin: user.isAdmin,
      });
    } else {
      return res.status(403).json({
        detail: 'You are not allowed to login. Please contact your administrator.',
      });
    }
  } catch (error) {
    console.error('Error in adminToken:', error);
    return res.status(500).json({ detail: 'Internal server error.' });
  }
}
