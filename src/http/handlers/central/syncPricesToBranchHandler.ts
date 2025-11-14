import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';
import { PriceRepositoryPrisma } from '../../../infra/repositories/prisma/PriceRepositoryPrisma';
import { syncPricesToBranch } from '../../../domain/usecases/syncPricesToBranch';
import { toSyncResultDTO } from '../../../infra/mappers/syncMapper';

export async function syncPricesToBranchHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { storeCode } = req.params;
    const prismaCentral = getPrismaCentral();
    const prismaBranch = getPrismaBranch();
    
    // Find store in central database by code
    const centralStore = await prismaCentral.store.findUnique({
      where: { code: storeCode },
    });

    if (!centralStore) {
      res.status(404).json({ 
        code: 'NOT_FOUND', 
        message: `Store with code ${storeCode} not found in central database` 
      });
      return;
    }

    // Step 1: Sync all stores from central to branch
    const centralStores = await prismaCentral.store.findMany();
    for (const store of centralStores) {
      await prismaBranch.store.upsert({
        where: { code: store.code },
        update: {
          name: store.name,
          type: store.type,
          city: store.city,
          active: store.active,
        },
        create: {
          code: store.code,
          name: store.name,
          type: store.type,
          city: store.city,
          active: store.active,
        },
      });
    }

    // Step 2: Sync all active products from central to branch
    const centralProducts = await prismaCentral.product.findMany({
      where: { active: true },
    });
    
    for (const product of centralProducts) {
      await prismaBranch.product.upsert({
        where: { code: product.code },
        update: {
          name: product.name,
          category: product.category,
          unit: product.unit,
          active: product.active,
        },
        create: {
          code: product.code,
          name: product.name,
          category: product.category,
          unit: product.unit,
          active: product.active,
        },
      });
    }

    // Step 3: Get active prices from central for this store
    const centralPrices = await prismaCentral.price.findMany({
      where: {
        storeId: centralStore.id,
        startDate: { lte: new Date() },
        OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
        product: { active: true },
      },
      include: {
        product: true,
        store: true,
      },
    });

    // Step 4: Find corresponding store and products in branch by code
    const branchStore = await prismaBranch.store.findUnique({
      where: { code: centralStore.code },
    });

    if (!branchStore) {
      res.status(500).json({ 
        code: 'SYNC_ERROR', 
        message: 'Failed to sync store to branch database' 
      });
      return;
    }

    // Step 5: Upsert prices to branch using branch IDs
    let syncedCount = 0;
    for (const centralPrice of centralPrices) {
      const branchProduct = await prismaBranch.product.findUnique({
        where: { code: centralPrice.product.code },
      });

      if (branchProduct) {
        await prismaBranch.price.upsert({
          where: {
            storeId_productId_startDate: {
              storeId: branchStore.id,
              productId: branchProduct.id,
              startDate: centralPrice.startDate,
            },
          },
          update: {
            salePrice: centralPrice.salePrice,
            endDate: centralPrice.endDate,
          },
          create: {
            storeId: branchStore.id,
            productId: branchProduct.id,
            salePrice: centralPrice.salePrice,
            startDate: centralPrice.startDate,
            endDate: centralPrice.endDate,
          },
        });
        syncedCount++;
      }
    }

    const resultDTO = toSyncResultDTO(syncedCount);
    res.status(200).json(resultDTO);
  } catch (error) {
    next(error);
  }
}
