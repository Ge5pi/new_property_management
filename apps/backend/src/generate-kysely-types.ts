import { db } from './database/custom-prisma-client';

async function main() {
  // Use the extended Prisma client with Kysely dialect
  // The driver is already set up in the extended client
  // So we can use it directly for code generation if supported

  // Since the previous codegen approach is broken, 
  // we will just destroy the db instance here for now

  await db.$disconnect();
}

main();
