import { Request, Response, NextFunction } from 'express';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';

export async function updateBranchInventoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const { productId, quantity } = req.body;
    const prismaBranch = getPrismaBranch();

    // Get branch store
    const store = await prismaBranch.store.findFirst({
      where: { type: 'BRANCH' },
    });

    if (!store) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Branch store not found' });
      return;
    }

    // Verify product exists
    const product = await prismaBranch.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      res.status(404).json({ code: 'NOT_FOUND', message: 'Product not found' });
      return;
    }

    // Upsert inventory
    const inventory = await prismaBranch.inventory.upsert({
      where: {
        storeId_productId: {
          storeId: store.id,
          productId: productId,
        },
      },
      update: {
        quantity: quantity,
      },
      create: {
        storeId: store.id,
        productId: productId,
        quantity: quantity,
      },
    });

    res.status(200).json({
      id: inventory.id,
      storeId: inventory.storeId,
      productId: inventory.productId,
      quantity: inventory.quantity,
      updatedAt: inventory.updatedAt,
    });
  } catch (error) {
    next(error);
  }
}
