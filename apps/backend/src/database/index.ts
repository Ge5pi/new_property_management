import { PrismaClient } from '@prisma/client';
import { Kysely } from 'kysely';
import { DB } from '../prisma/generated';
import { KyselyExtension } from 'prisma-extension-kysely';

export const db = new PrismaClient().$extends(
  new KyselyExtension({
    kysely: (driver) =>
      new Kysely<DB>({
        dialect: {
          createAdapter: () => driver.createAdapter(),
          createDriver: () => driver,
          createIntrospector: (db) => driver.createIntrospector(db),
          createQueryCompiler: () => driver.createQueryCompiler(),
        },
      }),
  })
);
