import { Request, Response, NextFunction } from 'express';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';
import { SaleRepositoryPrisma } from '../../../infra/repositories/prisma/SaleRepositoryPrisma';
import { StoreRepositoryPrisma } from '../../../infra/repositories/prisma/StoreRepositoryPrisma';
import { createBranchSale } from '../../../domain/usecases/createBranchSale';
import { toSaleDTO } from '../../../infra/mappers/saleMapper';

export async function createBranchSaleHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaBranch = getPrismaBranch();
    const saleRepository = new SaleRepositoryPrisma(prismaBranch);
    const storeRepository = new StoreRepositoryPrisma(prismaBranch);

    // Get store from branch database (Bondowoso branch)
    const store = await prismaBranch.store.findFirst({
      where: { type: 'BRANCH' },
    });

    if (!store) {
      res.status(404).json({
        code: 'NOT_FOUND',
        message: 'Branch store not found',
      });
      return;
    }

    const { idempotencyKey, items } = req.body;

    // Check if sale already exists (idempotency check)
    const existingSale = await saleRepository.findByIdempotencyKey(store.id, idempotencyKey);

    if (existingSale) {
      // Return existing sale with 200 status
      const saleDTO = toSaleDTO(existingSale, store);
      res.status(200).json(saleDTO);
      return;
    }

    // Create new sale
    const sale = await createBranchSale(saleRepository, {
      storeId: store.id,
      idempotencyKey,
      items,
    });

    const saleDTO = toSaleDTO(sale, store);
    res.status(201).json(saleDTO);
  } catch (error) {
    next(error);
  }
}
