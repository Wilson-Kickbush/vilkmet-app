import { PrismaClient } from "@prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import { Pool } from "pg";

// Patrón singleton para evitar múltiples conexiones en desarrollo con hot-reload
const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient() {
  // DATABASE_URL usa pgbouncer (puerto 6543) — ideal para runtime/serverless
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
  });
  const adapter = new PrismaPg(pool);
  return new PrismaClient({ adapter });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
