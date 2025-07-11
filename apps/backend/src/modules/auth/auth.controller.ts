import { Request, Response } from 'express';

interface AuthenticatedRequest extends Request {
  user?: any;
}
import { sign, verify, SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config';
import { db } from '../../database/custom-prisma-client';
import bcrypt from 'bcryptjs';
import { pbkdf2, timingSafeEqual } from 'crypto';
import { promisify } from 'util';

const pbkdf2Async = promisify(pbkdf2);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

async function verifyDjangoPassword(password: string, djangoHash: string): Promise<boolean> {
  try {
    const [algorithm, iterationsStr, salt, storedHash] = djangoHash.split('$');

    if (algorithm !== 'pbkdf2_sha256') {
      return false;
    }
    const iterations = parseInt(iterationsStr, 10);
    const keylen = Buffer.from(storedHash, 'base64').length;

    const derivedKey = await pbkdf2Async(
      password,
      salt,
      iterations,
      keylen,
      'sha256'
    );

    return timingSafeEqual(Buffer.from(storedHash, 'base64'), derivedKey);
  } catch (e) {
    console.error("Error verifying Django hash:", e);
    return false;
  }
}

export async function adminToken(req: Request, res: Response): Promise<void> {
  try {
    const { email, password } = req.body;

    const user = await db.user.findUnique({
      where: { email },
    });

    if (!user) {
      res.status(401).json({ detail: 'Invalid credentials.' });
      return;
    }

    let passwordValid = false;

    if (user.passwordHash.startsWith('pbkdf2_sha256$')) {
      passwordValid = await verifyDjangoPassword(password, user.passwordHash);
    } else {
      passwordValid = await bcrypt.compare(password, user.passwordHash);
    }

    if (!passwordValid) {
      res.status(401).json({ detail: 'Invalid credentials.' });
      return;
    }

    if (
      (user.isStaff || user.isSubscriptionStaff)
    ) {
      const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN };
      const token = sign(
        { userId: user.id, email: user.email, isAdmin: user.isStaff },
        JWT_SECRET,
        signOptions
      );

      res.json({
        access: token,
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
    console.error('Critical error in adminToken:', error);
    res.status(500).json({ detail: 'Internal server error.' });
  }
}

export async function currentUserDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ detail: 'Authentication token is missing or invalid.' });
      return;
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        username: true,
        isStaff: true,
      },
    });

    if (!user) {
      res.status(404).json({ detail: 'User not found.' });
      return;
    }

    res.json(user);

  } catch (error) {
    console.error('Error fetching current user details:', error);
    res.status(500).json({ detail: 'Internal server error.' });
  }
}

export async function tokenRefresh(req: Request, res: Response): Promise<void> {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      res.status(400).json({ detail: 'Refresh token is required.' });
      return;
    }

verify(refreshToken, JWT_SECRET, async (err: any, decoded: any) => {
      if (err) {
        res.status(403).json({ detail: 'Invalid refresh token.' });
        return;
      }

      const user = await db.user.findUnique({
        where: { id: decoded.userId },
      });

      if (!user) {
        res.status(404).json({ detail: 'User not found.' });
        return;
      }

      const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN };
      const newAccessToken = sign(
        { userId: user.id, email: user.email, isAdmin: user.isStaff },
        JWT_SECRET,
        signOptions
      );

      res.json({ access: newAccessToken });
    });
  } catch (error) {
    console.error('Error refreshing token:', error);
    res.status(500).json({ detail: 'Internal server error.' });
  }
}