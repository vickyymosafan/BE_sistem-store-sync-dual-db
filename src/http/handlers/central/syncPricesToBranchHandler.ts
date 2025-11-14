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
    const { storeId } = req.params;
    const prismaCentral = getPrismaCentral();
    const prismaBranch = getPrismaBranch();
    
    const centralPriceRepository = new PriceRepositoryPrisma(prismaCentral);
    const branchPriceRepository = new PriceRepositoryPrisma(prismaBranch);

    const result = await syncPricesToBranch(
      centralPriceRepository,
      branchPriceRepository,
      { storeId }
    );

    const resultDTO = toSyncResultDTO(result.count);
    res.status(200).json(resultDTO);
  } catch (error) {
    next(error);
  }
}
