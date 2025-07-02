import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });
import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  const email = 'dev@dev.com';
  const password = 'dev1234'; // You may want to hash this in production
  const name = 'Dev Admin';
  const role = 'admin';

  // Upsert the dev user
  const user = await prisma.user.upsert({
    where: { email },
    update: { name, role },
    create: {
      email,
      name,
      role: 'admin',
      password, // Only for dev/testing
      emailVerified: new Date(),
    },
  });
  console.log('Dev admin user:', user);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
}).finally(() => {
  prisma.$disconnect();
}); 