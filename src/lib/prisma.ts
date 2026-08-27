import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

const globalForPrisma = global as unknown as { prisma?: PrismaClient };

function makePrisma() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // During build, DATABASE_URL may be absent. We still need a valid client
    // for type generation, but actual queries will fail until the env is set.
    return new PrismaClient({ log: ['error'] });
  }
  const adapter = new PrismaPg({ connectionString: url });
  return new PrismaClient({
    adapter,
    log: process.env.NODE_ENV === 'development' ? ['error', 'warn'] : ['error']
  });
}

export const prisma = globalForPrisma.prisma ?? makePrisma();

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;
