import { PrismaClient } from '@prisma/client';
import { Kysely, PrismaDialect } from 'kysely';
import { Codegen } from 'kysely-codegen';

async function main() {
  const db = new Kysely<any>({
    dialect: new PrismaDialect({
      prisma: new PrismaClient(),
    }),
  });

  const codegen = new Codegen({
    kysely: db,
    dialect: 'prisma',
    out: './src/database/types.ts',
  });

  await codegen.generate();
  await db.destroy();
}

main();
