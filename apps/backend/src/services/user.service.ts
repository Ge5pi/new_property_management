import { PrismaClient, User } from '../../generated/prisma';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || '', {
  apiVersion: '2024-06-20',
});

export const createUser = async (userData: Omit<User, 'id' | 'createdAt' | 'updatedAt' | 'stripeCustomerId'>): Promise<User> => {
  const stripeCustomer = await stripe.customers.create({
    email: userData.email,
  });

  const user = await prisma.user.create({
    data: {
      ...userData,
      stripeCustomerId: stripeCustomer.id,
    },
  });

  return user;
};
