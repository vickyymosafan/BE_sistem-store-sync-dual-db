import { Request, Response, NextFunction } from 'express';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';
import { SaleRepositoryPrisma } from '../../../infra/repositories/prisma/SaleRepositoryPrisma';
import { StoreRepositoryPrisma } from '../../../infra/repositories/prisma/StoreRepositoryPrisma';
import { listBranchSales } from '../../../domain/usecases/listBranchSales';
import { toSaleDTO } from '../../../infra/mappers/saleMapper';

export async function listBranchSalesHandler(
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

    // Parse query parameters
    const { startDate, endDate } = req.query;
    const startDateObj = startDate ? new Date(startDate as string) : undefined;
    const endDateObj = endDate ? new Date(endDate as string) : undefined;

    const sales = await listBranchSales(saleRepository, store.id, startDateObj, endDateObj);

    const saleDTOs = sales.map((sale) => toSaleDTO(sale, store));

    res.status(200).json(saleDTOs);
  } catch (error) {
    next(error);
  }
}
