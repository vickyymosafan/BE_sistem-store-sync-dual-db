import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { PriceRepositoryPrisma } from '../../../infra/repositories/prisma/PriceRepositoryPrisma';
import { createOrUpdatePrice } from '../../../domain/usecases/createOrUpdatePrice';

export async function createOrUpdatePriceHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaCentral = getPrismaCentral();
    const priceRepository = new PriceRepositoryPrisma(prismaCentral);

    const { storeId, productId, salePrice, startDate, endDate } = req.body;

    const price = await createOrUpdatePrice(priceRepository, {
      storeId,
      productId,
      salePrice,
      startDate: new Date(startDate),
      endDate: endDate ? new Date(endDate) : undefined,
    });

    res.status(201).json({
      id: price.id,
      storeId: price.storeId,
      productId: price.productId,
      salePrice: price.salePrice,
      startDate: price.startDate.toISOString(),
      endDate: price.endDate ? price.endDate.toISOString() : null,
    });
  } catch (error) {
    next(error);
  }
}
