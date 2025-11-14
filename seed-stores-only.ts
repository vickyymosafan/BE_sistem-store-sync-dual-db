import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const prismaCentral = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_CENTRAL || process.env.DATABASE_URL,
    },
  },
});

const prismaBranch = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_BRANCH_BONDOWOSO,
    },
  },
});

async function main() {
  console.log('Creating stores in both databases...');

  // Upsert stores in central database
  const centralStore = await prismaCentral.store.upsert({
    where: { code: 'JMB-001' },
    update: {},
    create: {
      code: 'JMB-001',
      name: 'Toko Pusat Jember',
      type: 'CENTRAL',
      city: 'Jember',
      active: true,
    },
  });

  const branchStoreInCentral = await prismaCentral.store.upsert({
    where: { code: 'BDW-001' },
    update: {},
    create: {
      code: 'BDW-001',
      name: 'Toko Cabang Bondowoso',
      type: 'BRANCH',
      city: 'Bondowoso',
      active: true,
    },
  });

  // Upsert stores in branch database
  await prismaBranch.store.upsert({
    where: { code: 'JMB-001' },
    update: {},
    create: {
      code: 'JMB-001',
      name: 'Toko Pusat Jember',
      type: 'CENTRAL',
      city: 'Jember',
      active: true,
    },
  });

  const branchStore = await prismaBranch.store.upsert({
    where: { code: 'BDW-001' },
    update: {},
    create: {
      code: 'BDW-001',
      name: 'Toko Cabang Bondowoso',
      type: 'BRANCH',
      city: 'Bondowoso',
      active: true,
    },
  });

  console.log('✅ Stores created successfully!');
  console.log('Central DB:', centralStore.name, branchStoreInCentral.name);
  console.log('Branch DB:', branchStore.name);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prismaCentral.$disconnect();
    await prismaBranch.$disconnect();
  });
