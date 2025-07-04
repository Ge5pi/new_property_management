import { PrismaClient } from '@prisma/client';
import { Kysely } from 'kysely';
import { DB } from '../../prisma/generated/types';

declare module '@prisma/client' {
  interface PrismaClient {
    $kysely: Kysely<DB>;
  }
}

// Workaround: add a global declaration to help TypeScript recognize $kysely on PrismaClient instances
declare global {
  interface PrismaClient {
    $kysely: Kysely<DB>;
  }
}
