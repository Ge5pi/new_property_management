// apps/backend/src/middleware/auth.middleware.ts

import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config';
import { db } from '../database/custom-prisma-client'; // Import the database client

// Define a more complete user payload for the request
interface AuthenticatedRequest extends Request {
  user?: any; // Using `any` for simplicity, you can create a specific type
}

// ✅ Note the function is now `async`
export const authenticateToken = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (token == null) {
      res.sendStatus(401);
      return;
    }

    // `jwt.verify` can be used with async/await if wrapped in a promise, but a callback is fine here.
    // For consistency with the rest of the new async logic, let's proceed with a manual async verification.
    
    const decoded: any = jwt.verify(token, JWT_SECRET);
    
    if (!decoded || !decoded.userId) {
        res.sendStatus(403);
        return;
    }

    // Fetch the full user from the database using the ID from the token
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      res.sendStatus(403); // User in token not found in DB
      return;
    }

    // Attach the entire user object to the request
    req.user = user;
    next();

  } catch (err) {
    // This will catch expired tokens, malformed tokens, etc.
    res.sendStatus(403);
  }
};