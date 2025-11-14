import { Request, Response, NextFunction } from 'express';
import { getPrismaBranch } from '../../../infra/db/prismaClientBranch';
import { InventoryRepositoryPrisma } from '../../../infra/repositories/prisma/InventoryRepositoryPrisma';
import { ProductRepositoryPrisma } from '../../../infra/repositories/prisma/ProductRepositoryPrisma';
import { listBranchInventory } from '../../../domain/usecases/listBranchInventory';
import { toInventoryWithProductDTO } from '../../../infra/mappers/inventoryMapper';

export async function listBranchInventoryHandler(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const prismaBranch = getPrismaBranch();
    const inventoryRepository = new InventoryRepositoryPrisma(prismaBranch);
    const productRepository = new ProductRepositoryPrisma(prismaBranch);

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

    const inventories = await listBranchInventory(inventoryRepository, store.id);

    // Fetch products for each inventory
    const inventoriesWithProducts = await Promise.all(
      inventories.map(async (inventory) => {
        const product = await productRepository.findById(inventory.productId);
        if (!product) {
          throw new Error(`Product not found for inventory: ${inventory.id}`);
        }
        return toInventoryWithProductDTO(inventory, product);
      })
    );

    res.status(200).json(inventoriesWithProducts);
  } catch (error) {
    next(error);
  }
}
