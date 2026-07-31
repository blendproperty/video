// Creates the first admin user from ADMIN_EMAIL / ADMIN_PASSWORD in .env.
// Run with: npm run db:seed
// Safe to re-run — skips if the user already exists.

import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
  const email = process.env.ADMIN_EMAIL;
  const password = process.env.ADMIN_PASSWORD;

  if (!email || !password) {
    throw new Error('Set ADMIN_EMAIL and ADMIN_PASSWORD in .env before seeding.');
  }

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    console.log(`User ${email} already exists — skipping.`);
    return;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  await prisma.user.create({ data: { email, passwordHash, name: 'Admin' } });
  console.log(`Created admin user: ${email}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
