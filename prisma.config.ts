import "dotenv/config";
import { defineConfig, env } from "prisma/config";

export default defineConfig({
  schema: "prisma/schema.prisma",
  migrations: {
    path: "prisma/migrations",
  },
  // Prisma CLI (db push, migrate) necesita conexión directa sin pgbouncer
  datasource: {
    url: env("DIRECT_URL"),
  },
});
