import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { StoreRepositoryPrisma } from '../../../infra/repositories/prisma/StoreRepositoryPrisma';
import { listStores } from '../../../domain/usecases/listStores';
import { toStoreDTO } from '../../../infra/mappers/storeMapper';

export async function listStoresHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaCentral = getPrismaCentral();
    const storeRepository = new StoreRepositoryPrisma(prismaCentral);

    const stores = await listStores(storeRepository);
    const storeDTOs = stores.map(toStoreDTO);

    res.status(200).json(storeDTOs);
  } catch (error) {
    next(error);
  }
}
