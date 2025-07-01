import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all users
router.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

// Get user by id
router.get('/users/:id', async (req, res) => {
  const { id } = req.params;
  const user = await prisma.user.findUnique({
    where: { id },
  });
  res.json(user);
});

import { createUser } from '../../services/user.service';

// ... (rest of the file)

// Create user
router.post('/users', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.json(user);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to create user' });
  }
});

// Update user
router.put('/users/:id', async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const user = await prisma.user.update({
    where: { id },
    data,
  });
  res.json(user);
});

// Delete user
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.user.delete({
    where: { id },
  });
  res.json({ message: 'User deleted successfully' });
});

export default router;
