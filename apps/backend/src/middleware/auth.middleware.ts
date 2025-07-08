import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { JWT_SECRET } from '../config'; // 1. Import from config

interface AuthenticatedRequest extends Request {
  userId?: string;
}

export const authenticateToken = (req: AuthenticatedRequest, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  // --- Start Debugging Logs ---
  console.log('--- Authenticate Token Middleware ---');
  console.log('Authorization Header:', authHeader);
  console.log('Extracted Token:', token);
  // --- End Debugging Logs ---

  if (token == null) {
    console.log('Middleware Result: No token provided. Sending 401.');
    res.sendStatus(401); 
    return;
  }

  // 2. Use the imported JWT_SECRET
  jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
    if (err) {
      // --- Start Debugging Logs ---
      console.log('Middleware Result: JWT verification failed. Sending 403.');
      console.error('JWT Error:', err.message);
      // --- End Debugging Logs ---
      res.sendStatus(403); 
      return;
    }
    
    console.log('Middleware Result: Token verified successfully. User:', user);
    req.userId = user.userId;
    next();
  });
};