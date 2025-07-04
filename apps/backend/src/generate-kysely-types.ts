import { Kysely, PostgresDialect } from 'kysely';
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

  // Kysely does not have a Codegen class, so we will generate types differently or remove this script
  // For now, just log a message and exit
  console.log('Kysely code generation script needs to be updated for the current version.');

  await db.end();
}

main();
