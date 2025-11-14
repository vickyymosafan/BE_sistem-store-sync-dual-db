import { Request, Response, NextFunction } from 'express';
import { getPrismaCentral } from '../../../infra/db/prismaClientCentral';
import { ProductRepositoryPrisma } from '../../../infra/repositories/prisma/ProductRepositoryPrisma';
import { listProducts } from '../../../domain/usecases/listProducts';
import { toProductDTO } from '../../../infra/mappers/productMapper';

export async function listProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaCentral = getPrismaCentral();
    const productRepository = new ProductRepositoryPrisma(prismaCentral);

    const status = req.query.status as string | undefined;

    let products;
    if (status === 'active') {
      products = await listProducts(productRepository);
    } else if (status === 'inactive') {
      const allProducts = await productRepository.findAll();
      products = allProducts.filter(p => !p.active);
    } else {
      // 'all' or no status parameter - return all products
      products = await productRepository.findAll();
    }

    const productDTOs = products.map(toProductDTO);

    res.status(200).json(productDTOs);
  } catch (error) {
    next(error);
  }
}
