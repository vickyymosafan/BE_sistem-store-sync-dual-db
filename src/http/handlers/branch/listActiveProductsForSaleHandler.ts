import { Request, Response, NextFunction } from 'express';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';

export async function listActiveProductsForSaleHandler(
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
    
    // Get products with ACTIVE prices only (for sale transactions)
    const products = await prismaBranch.product.findMany({
      where: { active: true },
      orderBy: { code: 'asc' },
    });
    
    const productsWithActivePrices = await Promise.all(
      products.map(async (product) => {
        // Get only currently active price
        const price = await prismaBranch.price.findFirst({
          where: {
            storeId: store.id,
            productId: product.id,
            startDate: { lte: new Date() },
            OR: [{ endDate: null }, { endDate: { gte: new Date() } }],
          },
          orderBy: { startDate: 'desc' },
        });
        
        // Only return products with active prices
        if (!price) return null;
        
        return {
          id: product.id,
          code: product.code,
          name: product.name,
          category: product.category,
          unit: product.unit,
          price: price.salePrice,
        };
      })
    );
    
    // Filter out null values (products without active prices)
    const validProducts = productsWithActivePrices.filter(p => p !== null);
    
    res.status(200).json(validProducts);
  } catch (error) {
    next(error);
  }
}
