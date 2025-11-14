import { Request, Response, NextFunction } from 'express';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';

export async function getBranchProductsHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaBranch = getPrismaBranch();
    
    // Get branch store
    const store = await prismaBranch.store.findFirst({
      where: { type: 'BRANCH' },
    });
    
    if (!store) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Branch store not found' });
      return;
    }
    
    // Get products with their prices (only active products)
    const products = await prismaBranch.product.findMany({
      where: { active: true },
      orderBy: { code: 'asc' },
    });
    
    const productsWithPrices = await Promise.all(
      products.map(async (product) => {
        const price = await prismaBranch.price.findFirst({
          where: {
            storeId: store.id,
            productId: product.id,
            startDate: { lte: new Date() },
            OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
          },
          orderBy: { startDate: 'desc' },
        });
        
        return {
          id: product.id,
          code: product.code,
          name: product.name,
          category: product.category,
          unit: product.unit,
          active: product.active,
          price: price?.salePrice,
          startDate: price?.startDate,
          endDate: price?.endDate,
        };
      })
    );
    
    res.status(200).json(productsWithPrices);
  } catch (error) {
    next(error);
  }
}

export async function getBranchStoresHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaBranch = getPrismaBranch();
    const stores = await prismaBranch.store.findMany();
    res.status(200).json(stores);
  } catch (error) {
    next(error);
  }
}
