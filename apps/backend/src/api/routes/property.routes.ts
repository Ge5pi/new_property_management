import { Router } from 'express';
import { PrismaClient } from '../../generated/prisma';

const router = Router();
const prisma = new PrismaClient();

// Get all properties
router.get('/properties', async (req, res) => {
  const properties = await prisma.property.findMany({
    include: {
      units: true,
      amenities: true,
    },
  });
  res.json(properties);
});

// Get property by id
router.get('/properties/:id', async (req, res) => {
  const { id } = req.params;
  const property = await prisma.property.findUnique({
    where: { id },
    include: {
      units: true,
      amenities: true,
    },
  });
  res.json(property);
});

// Create property
router.post('/properties', async (req, res) => {
  const { name, address, city, state, zipCode, country } = req.body;
  const property = await prisma.property.create({
    data: {
      name,
      address,
      city,
      state,
      zipCode,
      country,
    },
  });
  res.json(property);
});

// Update property
router.put('/properties/:id', async (req, res) => {
  const { id } = req.params;
  const { ...data } = req.body;
  const property = await prisma.property.update({
    where: { id },
    data,
  });
  res.json(property);
});

// Delete property
router.delete('/properties/:id', async (req, res) => {
  const { id } = req.params;
  await prisma.property.delete({
    where: { id },
  });
  res.json({ message: 'Property deleted successfully' });
});

export default router;
