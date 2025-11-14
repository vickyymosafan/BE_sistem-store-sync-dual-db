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

    // Get branch store
    const branchStore = await prismaBranch.store.findFirst({
      where: { type: 'BRANCH' },
    });

    if (!branchStore) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Branch store not found',
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

    const result = await syncBranchSalesToCentral(
      branchSaleRepository,
      centralSaleRepository,
      centralSyncLogRepository,
      {
        branchStoreId: branchStore.id,
        centralStoreId: centralStore.id,
      }
    );

    const resultDTO = toSyncResultDTO(result.count);
    res.status(200).json(resultDTO);
  } catch (error) {
    next(error);
  }
}
