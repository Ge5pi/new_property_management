import type { PrismaClient } from '@prisma/client';
import { Kysely, PostgresDialect } from 'kysely';
import type { DB } from '../../prisma/generated/types';
import kysely from 'prisma-extension-kysely';

const PrismaClientConstructor = require('@prisma/client').PrismaClient;

const createExtendedPrismaClient = () => {
  const prismaClient = new PrismaClientConstructor();

  return prismaClient.$extends(
    kysely({
      kysely: (driver: any) =>
        new Kysely<DB>({
          dialect: new PostgresDialect({
            pool: driver,
          }),
        }),
    })
  );
};

const prisma = createExtendedPrismaClient();

export { prisma as db };
export type CustomPrismaClient = typeof prisma;
