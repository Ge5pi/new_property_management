import { Codegen, PostgresDialect } from 'kysely-codegen';
import { Pool } from 'pg';
import * as dotenv from 'dotenv';
import { promises as fs } from 'fs';
import * as path from 'path';

dotenv.config();

async function main() {
  const db = new Pool({
    connectionString: process.env.DATABASE_URL,
  });

  const dialect = new PostgresDialect({
    pool: db,
  });

  const codegen = new Codegen({
    dialect,
    // outFile: path.join(__dirname, '../prisma/generated/types.ts'),
    outFile: path.join(__dirname, './generated/types.ts'),
  });

  const result = await codegen.generate();

  await fs.writeFile(result.outFile, result.code);

  await db.end();
}

main();