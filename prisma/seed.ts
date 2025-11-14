import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting database seed...');

  // Create Stores
  console.log('Creating stores...');
  const centralStore = await prisma.store.upsert({
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

  const branchStore = await prisma.store.upsert({
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

  console.log(`Created stores: ${centralStore.name}, ${branchStore.name}`);

  // Create Products
  console.log('Creating products...');
  const products = [
    { code: 'PRD-001', name: 'Beras Premium 5kg', category: 'Sembako', unit: 'kg' },
    { code: 'PRD-002', name: 'Minyak Goreng 2L', category: 'Sembako', unit: 'liter' },
    { code: 'PRD-003', name: 'Gula Pasir 1kg', category: 'Sembako', unit: 'kg' },
    { code: 'PRD-004', name: 'Tepung Terigu 1kg', category: 'Sembako', unit: 'kg' },
    { code: 'PRD-005', name: 'Kopi Bubuk 200g', category: 'Minuman', unit: 'gram' },
    { code: 'PRD-006', name: 'Teh Celup 25 bags', category: 'Minuman', unit: 'box' },
    { code: 'PRD-007', name: 'Susu UHT 1L', category: 'Minuman', unit: 'liter' },
    { code: 'PRD-008', name: 'Telur Ayam 1kg', category: 'Protein', unit: 'kg' },
    { code: 'PRD-009', name: 'Mie Instan', category: 'Makanan', unit: 'pcs' },
    { code: 'PRD-010', name: 'Sabun Mandi', category: 'Kebersihan', unit: 'pcs' },
    { code: 'PRD-011', name: 'Shampo Sachet', category: 'Kebersihan', unit: 'pcs' },
    { code: 'PRD-012', name: 'Pasta Gigi', category: 'Kebersihan', unit: 'pcs' },
    { code: 'PRD-013', name: 'Detergen 1kg', category: 'Kebersihan', unit: 'kg' },
    { code: 'PRD-014', name: 'Tissue Roll', category: 'Kebersihan', unit: 'roll' },
    { code: 'PRD-015', name: 'Air Mineral 1.5L', category: 'Minuman', unit: 'liter' },
  ];

  const createdProducts: any[] = [];
  for (const product of products) {
    const created = await prisma.product.upsert({
      where: { code: product.code },
      update: {},
      create: {
        ...product,
        active: true,
      },
    });
    createdProducts.push(created);
  }

  console.log(`Created ${createdProducts.length} products`);

  // Create Prices for both stores
  console.log('Creating prices...');
  const prices = [
    { productCode: 'PRD-001', salePrice: 65000 },
    { productCode: 'PRD-002', salePrice: 28000 },
    { productCode: 'PRD-003', salePrice: 15000 },
    { productCode: 'PRD-004', salePrice: 12000 },
    { productCode: 'PRD-005', salePrice: 25000 },
    { productCode: 'PRD-006', salePrice: 8000 },
    { productCode: 'PRD-007', salePrice: 18000 },
    { productCode: 'PRD-008', salePrice: 32000 },
    { productCode: 'PRD-009', salePrice: 3000 },
    { productCode: 'PRD-010', salePrice: 5000 },
    { productCode: 'PRD-011', salePrice: 2000 },
    { productCode: 'PRD-012', salePrice: 12000 },
    { productCode: 'PRD-013', salePrice: 18000 },
    { productCode: 'PRD-014', salePrice: 15000 },
    { productCode: 'PRD-015', salePrice: 4000 },
  ];

  let priceCount = 0;
  const startDate = new Date('2024-01-01');

  for (const store of [centralStore, branchStore]) {
    for (const priceData of prices) {
      const product = createdProducts.find((p) => p.code === priceData.productCode);
      if (product) {
        await prisma.price.upsert({
          where: {
            storeId_productId_startDate: {
              storeId: store.id,
              productId: product.id,
              startDate: startDate,
            },
          },
          update: {},
          create: {
            storeId: store.id,
            productId: product.id,
            salePrice: priceData.salePrice,
            startDate: startDate,
            endDate: null,
          },
        });
        priceCount++;
      }
    }
  }

  console.log(`Created ${priceCount} price records`);

  // Create Inventory for branch store
  console.log('Creating inventory for branch store...');
  const inventoryData = [
    { productCode: 'PRD-001', quantity: 50 },
    { productCode: 'PRD-002', quantity: 30 },
    { productCode: 'PRD-003', quantity: 40 },
    { productCode: 'PRD-004', quantity: 35 },
    { productCode: 'PRD-005', quantity: 25 },
    { productCode: 'PRD-006', quantity: 60 },
    { productCode: 'PRD-007', quantity: 45 },
    { productCode: 'PRD-008', quantity: 20 },
    { productCode: 'PRD-009', quantity: 100 },
    { productCode: 'PRD-010', quantity: 80 },
    { productCode: 'PRD-011', quantity: 120 },
    { productCode: 'PRD-012', quantity: 70 },
    { productCode: 'PRD-013', quantity: 40 },
    { productCode: 'PRD-014', quantity: 90 },
    { productCode: 'PRD-015', quantity: 150 },
  ];

  let inventoryCount = 0;
  for (const invData of inventoryData) {
    const product = createdProducts.find((p) => p.code === invData.productCode);
    if (product) {
      await prisma.inventory.upsert({
        where: {
          storeId_productId: {
            storeId: branchStore.id,
            productId: product.id,
          },
        },
        update: {},
        create: {
          storeId: branchStore.id,
          productId: product.id,
          quantity: invData.quantity,
        },
      });
      inventoryCount++;
    }
  }

  console.log(`Created ${inventoryCount} inventory records for branch store`);

  console.log('Database seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error seeding database:', e);
    throw e;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
