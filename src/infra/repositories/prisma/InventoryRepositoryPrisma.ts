import { PrismaClient } from '@prisma/client';
import { Inventory } from '../../../domain/entities/Inventory';
import { IInventoryRepository } from '../../../domain/repositories/IInventoryRepository';

export class InventoryRepositoryPrisma implements IInventoryRepository {
  constructor(private prisma: PrismaClient) {}

  async findByStoreId(storeId: string): Promise<Inventory[]> {
    const inventories = await this.prisma.inventory.findMany({
      where: { storeId },
    });
    return inventories.map(this.toDomain);
  }

  async updateQuantity(storeId: string, productId: string, quantity: number): Promise<void> {
    await this.prisma.inventory.update({
      where: {
        storeId_productId: {
          storeId,
          productId,
        },
      },
      data: { quantity },
    });
  }

  private toDomain(inventory: any): Inventory {
    return {
      id: inventory.id,
      storeId: inventory.storeId,
      productId: inventory.productId,
      quantity: inventory.quantity,
      updatedAt: inventory.updatedAt,
    };
  }
}
