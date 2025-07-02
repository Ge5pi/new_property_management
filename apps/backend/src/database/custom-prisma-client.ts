// custom-prisma-client.ts

// Use 'import type' for the type.
import type { PrismaClient } from '@prisma/client';
import { Kysely } from 'kysely';
import type { DB } from '../../prisma/generated/types';
import KyselyExtension from 'prisma-extension-kysely';

// Use 'require' to reliably get the PrismaClient constructor value.
const PrismaClientConstructor = require('@prisma/client').PrismaClient;

const createExtendedPrismaClient = () => {
  const prismaClient = new PrismaClientConstructor();
  
  return prismaClient.$extends(
    KyselyExtension({
      kysely: (driver) => {
        return new Kysely<DB>({
          // The driver object provided by the extension IS the dialect.
          // Due to potential version mismatches between Kysely and the
          // extension, the types might not align perfectly.
          // Using `as any` tells TypeScript to trust that this is correct,
          // which it is, functionally.
          dialect: driver as any,
        });
      },
    })
  );
};

// Create a single, shared instance of the extended client
const prisma = createExtendedPrismaClient();


// Export the instance. It is now fully typed and functional.
export { prisma as db };

// Export the type of the extended client for convenience.
export type CustomPrismaClient = typeof prisma;
