import { Request, Response } from 'express';
import { sign, SignOptions } from 'jsonwebtoken';
import { JWT_SECRET, JWT_EXPIRES_IN } from '../../config';
import { db } from '../../database/custom-prisma-client';
import bcrypt from 'bcryptjs';
import { pbkdf2, timingSafeEqual } from 'crypto'; // 1. Импортируем из встроенного модуля crypto
import { promisify } from 'util'; // Утилита для работы с callback-функциями

// Оборачиваем pbkdf2 в Promise для удобной работы с async/await
const pbkdf2Async = promisify(pbkdf2);

interface AuthenticatedRequest extends Request {
  userId?: string;
}

/**
 * Проверяет пароль по хешу формата Django pbkdf2_sha256.
 * @param password Пароль, введенный пользователем.
 * @param djangoHash Хеш из базы данных.
 * @returns Promise<boolean>
 */
async function verifyDjangoPassword(password: string, djangoHash: string): Promise<boolean> {
  try {
    const [algorithm, iterationsStr, salt, storedHash] = djangoHash.split('$');

    if (algorithm !== 'pbkdf2_sha256') {
      return false; // Не наш формат, не можем проверить
    }
    const iterations = parseInt(iterationsStr, 10);
    const keylen = Buffer.from(storedHash, 'base64').length;

    // Генерируем новый хеш с теми же параметрами, что и у Django
    const derivedKey = await pbkdf2Async(
        password, 
        salt, 
        iterations, 
        keylen, 
        'sha256'
    );
    
    // Сравниваем хеш из БД с только что сгенерированным
    return timingSafeEqual(Buffer.from(storedHash, 'base64'), derivedKey);
  } catch (e) {
    console.error("Ошибка при проверке Django-хеша:", e);
    return false;
  }
}


// --- Основная функция контроллера ---
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

    // Проверяем, старый ли это хеш от Django
    if (user.passwordHash.startsWith('pbkdf2_sha256$')) {
        passwordValid = await verifyDjangoPassword(password, user.passwordHash);
    } else {
      // Если хеш уже нового формата, используем bcrypt
      passwordValid = await bcrypt.compare(password, user.passwordHash);
    }

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
    console.error('Критическая ошибка в adminToken:', error);
    res.status(500).json({ detail: 'Internal server error.' });
  }
}

export async function currentUserDetails(req: AuthenticatedRequest, res: Response): Promise<void> {
  try {
    const userId = req.userId; // Get userId from the token (added by auth.middleware)

    if (!userId) {
      // This should theoretically not happen if authenticateToken middleware is working
      res.status(401).json({ detail: 'Authentication token is missing or invalid.' });
      return;
    }

    const user = await db.user.findUnique({
      where: { id: userId },
      select: { // Select only the fields you want to send to the frontend
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