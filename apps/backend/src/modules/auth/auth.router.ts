import { Router } from 'express';
import express from 'express';
import corsMiddleware from '../../middleware/cors.middleware';
import * as authController from './auth.controller';
import { authenticateToken } from '../../middleware/auth.middleware';

import userRouter from '../user/user.router';
import groupRouter from '../group/group.router';

const router = Router();

// --- Маршрут для получения токена ---
router.options('/admin-token', corsMiddleware);
router.post(
  '/admin-token',
  corsMiddleware,
  express.json(),
  authController.adminToken
);

// --- Маршрут для обновления токена ---
router.options('/token/refresh', corsMiddleware);
router.post(
  '/token/refresh',
  corsMiddleware,
  express.json(),
  authController.tokenRefresh
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

// Add user and group routers
router.use('/users', userRouter);
router.use('/groups', groupRouter);

export default router;
