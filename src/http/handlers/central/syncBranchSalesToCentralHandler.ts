import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';
import { SaleRepositoryPrisma } from '../../../infra/repositories/prisma/SaleRepositoryPrisma';
import { SyncLogRepositoryPrisma } from '../../../infra/repositories/prisma/SyncLogRepositoryPrisma';
import { syncBranchSalesToCentral } from '../../../domain/usecases/syncBranchSalesToCentral';
import { toSyncResultDTO } from '../../../infra/mappers/syncMapper';

export async function syncBranchSalesToCentralHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaCentral = getPrismaCentral();
    const prismaBranch = getPrismaBranch();

    const branchSaleRepository = new SaleRepositoryPrisma(prismaBranch);
    const centralSaleRepository = new SaleRepositoryPrisma(prismaCentral);
    const centralSyncLogRepository = new SyncLogRepositoryPrisma(prismaCentral);

    // Get branch store from branch database
    const branchStore = await prismaBranch.store.findFirst({
      where: { type: 'BRANCH' },
    });

    if (!branchStore) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Branch store not found in branch database',
      });
      return;
    }

    // Get corresponding store in central database by CODE
    const centralBranchStore = await prismaCentral.store.findUnique({
      where: { code: branchStore.code },
    });

    if (!centralBranchStore) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: `Store with code ${branchStore.code} not found in central database`,
      });
      return;
    }

    // Get central store
    const centralStore = await prismaCentral.store.findFirst({
      where: { type: 'CENTRAL' },
    });

    if (!centralStore) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Central store not found',
      });
      return;
    }

    // Get pending sales from branch
    const pendingSales = await prismaBranch.sale.findMany({
      where: {
        storeId: branchStore.id,
        syncStatus: 'PENDING',
      },
      include: {
        items: {
          include: {
            product: true,
          },
        },
      },
    });

    if (pendingSales.length === 0) {
      const resultDTO = toSyncResultDTO(0);
      res.status(200).json(resultDTO);
      return;
    }

    // Sync each sale with its items to central
    let syncedCount = 0;
    for (const branchSale of pendingSales) {
      // Check if sale already exists in central (idempotency)
      const existingSale = await prismaCentral.sale.findUnique({
        where: {
          storeId_idempotencyKey: {
            storeId: centralBranchStore.id,
            idempotencyKey: branchSale.idempotencyKey,
          },
        },
      });

      if (existingSale) {
        // Already synced, just update branch status
        await prismaBranch.sale.update({
          where: { id: branchSale.id },
          data: { syncStatus: 'SYNCED' },
        });
        syncedCount++;
        continue;
      }

      // Create sale in central with items
      const saleItems = [];
      for (const item of branchSale.items) {
        // Find product in central by code
        const centralProduct = await prismaCentral.product.findUnique({
          where: { code: item.product.code },
        });

        if (centralProduct) {
          saleItems.push({
            productId: centralProduct.id,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          });
        }
      }

      // Create sale in central
      await prismaCentral.sale.create({
        data: {
          storeId: centralBranchStore.id,
          timestamp: branchSale.timestamp,
          grandTotal: branchSale.grandTotal,
          syncStatus: 'SYNCED',
          idempotencyKey: branchSale.idempotencyKey,
          items: {
            create: saleItems,
          },
        },
      });

      // Update branch sale status
      await prismaBranch.sale.update({
        where: { id: branchSale.id },
        data: { syncStatus: 'SYNCED' },
      });

      syncedCount++;
    }

    // Create sync log
    await prismaCentral.syncLog.create({
      data: {
        sourceStoreId: centralBranchStore.id,
        targetStoreId: centralStore.id,
        notes: `Synced ${syncedCount} sales from branch to central`,
        summaryCount: syncedCount,
      },
    });

    const resultDTO = toSyncResultDTO(syncedCount);
    res.status(200).json(resultDTO);
  } catch (error) {
    next(error);
  }
}
