import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { PriceRepositoryPrisma } from '../../../infra/repositories/prisma/PriceRepositoryPrisma';
import { ProductRepositoryPrisma } from '../../../infra/repositories/prisma/ProductRepositoryPrisma';
import { listActivePrices } from '../../../domain/usecases/listActivePrices';
import { toPriceWithProductDTO } from '../../../infra/mappers/priceMapper';

export async function listActivePricesHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { storeId } = req.params;
    const prismaCentral = getPrismaCentral();
    const priceRepository = new PriceRepositoryPrisma(prismaCentral);
    const productRepository = new ProductRepositoryPrisma(prismaCentral);

    const prices = await listActivePrices(priceRepository, storeId);

    // Fetch products for each price
    const pricesWithProducts = await Promise.all(
      prices.map(async (price) => {
        const product = await productRepository.findById(price.productId);
        if (!product) {
          throw new Error(`Product not found for price: ${price.id}`);
        }
        return toPriceWithProductDTO(price, product);
      })
    );

    res.status(200).json(pricesWithProducts);
  } catch (error) {
    next(error);
  }
}
