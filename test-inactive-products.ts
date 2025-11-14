import { PrismaClient } from '@prisma/client';
import * as dotenv from 'dotenv';

dotenv.config();

const prisma = new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL_CENTRAL || process.env.DATABASE_URL,
    },
  },
});

async function main() {
  console.log('Menonaktifkan beberapa produk untuk testing...');

  // Nonaktifkan beberapa produk
  const productsToDeactivate = ['PRD-006', 'PRD-011', 'PRD-014'];

  for (const code of productsToDeactivate) {
    const product = await prisma.product.update({
      where: { code },
      data: { active: false },
    });
    console.log(`✅ Produk ${product.name} (${code}) dinonaktifkan`);
  }

  console.log('\n📊 Ringkasan:');
  const activeCount = await prisma.product.count({ where: { active: true } });
  const inactiveCount = await prisma.product.count({ where: { active: false } });
  console.log(`Produk Aktif: ${activeCount}`);
  console.log(`Produk Nonaktif: ${inactiveCount}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
