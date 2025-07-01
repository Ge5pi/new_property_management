import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all roles
router.get('/roles', async (req, res) => {
  const roles = await prisma.role.findMany();
  res.json(roles);
});

// Get role by id
router.get('/roles/:id', async (req, res) => {
  const { id } = req.params;
  const role = await prisma.role.findUnique({
    where: { id },
  });
  res.json(role);
});

// Create role
router.post('/roles', async (req, res) => {
  const { name, description } = req.body;
  const role = await prisma.role.create({
    data: {
      name,
      description,
    },
  });
  res.json(role);
});

// Update role
router.put('/roles/:id', async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const role = await prisma.role.update({
    where: { id },
    data,
  });
  res.json(role);
});

// Delete role
router.delete('/roles/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.role.delete({
    where: { id },
  });
  res.json({ message: 'Role deleted successfully' });
});

export default router;
