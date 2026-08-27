import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import * as crypto from 'crypto';

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error('DATABASE_URL is not set');
  process.exit(1);
}

const adapter = new PrismaPg({ connectionString: DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  // Generate a session token
  const token = crypto.randomBytes(32).toString('hex');
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days

  // Upsert the admin session
  const session = await prisma.adminSession.upsert({
    where: { token },
    update: { expiresAt },
    create: { token, expiresAt },
  });

  console.log(`Admin session created: ${session.token}`);
  console.log(`Login at: https://leads-crm-eta.vercel.app/login`);
  console.log(`Password: ${process.env.ADMIN_PASSWORD || 'protech2026'}`);
}

main().catch(e => {
  console.error(e);
  process.exit(1);
}).finally(async () => {
  await prisma.$disconnect();
});
