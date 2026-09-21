import { PrismaClient } from "@prisma/client";

// Prisma 7: connection URL passed to client constructor, not in schema.prisma
// In production, use the DATABASE_URL from env.
// For Accelerate (serverless), pass accelerateUrl instead.
// For direct connection (traditional Postgres), pass the database URL.

function getDbUrl(): string {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Development fallback — local Postgres
    return "postgresql://postgres:password@localhost:5432/youna?sslmode=disable";
  }
  return url;
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient | undefined };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query", "error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;

export default prisma;
