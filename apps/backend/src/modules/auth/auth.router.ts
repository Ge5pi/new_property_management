import { Router } from 'express';
import express from 'express';
import corsMiddleware from '../../middleware/cors.middleware';
import * as authController from './auth.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

const router = Router();

// --- Маршрут для получения токена ---
router.options('/admin-token', corsMiddleware);
router.post(
  '/admin-token',
  corsMiddleware,
  express.json(),
  authController.adminToken
);

// --- Маршрут для получения данных текущего пользователя ---

// 1. Добавьте эту строку для обработки OPTIONS запроса
router.options('/current-user-details', corsMiddleware);

// 2. Добавьте corsMiddleware в цепочку для GET запроса
router.get(
  '/current-user-details',
  corsMiddleware,
  authenticateToken,
  authController.currentUserDetails
);


export default router;