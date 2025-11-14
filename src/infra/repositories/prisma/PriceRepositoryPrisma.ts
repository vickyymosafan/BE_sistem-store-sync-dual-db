import { PrismaClient } from '@prisma/client';
import { Price } from '../../../domain/entities/Price';
import { IPriceRepository } from '../../../domain/repositories/IPriceRepository';

export class PriceRepositoryPrisma implements IPriceRepository {
  constructor(private prisma: PrismaClient) {}

  async findActiveByStoreId(storeId: string, date: Date): Promise<Price[]> {
    const prices = await this.prisma.price.findMany({
      where: {
        storeId,
        startDate: { lte: date },
        OR: [{ endDate: null }, { endDate: { gte: date } }],
      },
    });
    return prices.map(this.toDomain);
  }

  async create(price: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>): Promise<Price> {
    const created = await this.prisma.price.create({
      data: {
        storeId: price.storeId,
        productId: price.productId,
        salePrice: price.salePrice,
        startDate: price.startDate,
        endDate: price.endDate,
      },
    });
    return this.toDomain(created);
  }

  async upsertBatch(prices: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number> {
    let count = 0;
    for (const price of prices) {
      await this.prisma.price.upsert({
        where: {
          storeId_productId_startDate: {
            storeId: price.storeId,
            productId: price.productId,
            startDate: price.startDate,
          },
        },
        update: {
          salePrice: price.salePrice,
          endDate: price.endDate,
        },
        create: {
          storeId: price.storeId,
          productId: price.productId,
          salePrice: price.salePrice,
          startDate: price.startDate,
          endDate: price.endDate,
        },
      });
      count++;
    }
    return count;
  }

  private toDomain(price: any): Price {
    return {
      id: price.id,
      storeId: price.storeId,
      productId: price.productId,
      salePrice: price.salePrice.toNumber(),
      startDate: price.startDate,
      endDate: price.endDate,
      createdAt: price.createdAt,
      updatedAt: price.updatedAt,
    };
  }
}
