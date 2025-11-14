import { PrismaClient } from '@prisma/client';
import { Sale, SyncStatus } from '../../../domain/entities/Sale';
import { SaleItem } from '../../../domain/entities/SaleItem';
import { ISaleRepository, DailySalesSummary } from '../../../domain/repositories/ISaleRepository';

export class SaleRepositoryPrisma implements ISaleRepository {
  constructor(private prisma: PrismaClient) {}

  async findByIdempotencyKey(storeId: string, key: string): Promise<Sale | null> {
    const sale = await this.prisma.sale.findUnique({
      where: {
        storeId_idempotencyKey: {
          storeId,
          idempotencyKey: key,
        },
      },
    });
    return sale ? this.toDomain(sale) : null;
  }

  async create(
    sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>,
    items: Omit<SaleItem, 'id' | 'saleId'>[]
  ): Promise<Sale> {
    const created = await this.prisma.sale.create({
      data: {
        storeId: sale.storeId,
        timestamp: sale.timestamp,
        grandTotal: sale.grandTotal,
        syncStatus: sale.syncStatus,
        idempotencyKey: sale.idempotencyKey,
        items: {
          create: items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            unitPrice: item.unitPrice,
            subtotal: item.subtotal,
          })),
        },
      },
    });
    return this.toDomain(created);
  }

  async findByStoreAndDateRange(
    storeId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Sale[]> {
    const where: any = { storeId };
    
    if (startDate || endDate) {
      where.timestamp = {};
      if (startDate) {
        where.timestamp.gte = startDate;
      }
      if (endDate) {
        where.timestamp.lte = endDate;
      }
    }

    const sales = await this.prisma.sale.findMany({ where });
    return sales.map(this.toDomain);
  }

  async findPendingByStoreId(storeId: string): Promise<Sale[]> {
    const sales = await this.prisma.sale.findMany({
      where: {
        storeId,
        syncStatus: 'PENDING',
      },
    });
    return sales.map(this.toDomain);
  }

  async updateSyncStatus(saleIds: string[], status: SyncStatus): Promise<void> {
    await this.prisma.sale.updateMany({
      where: {
        id: { in: saleIds },
      },
      data: {
        syncStatus: status,
      },
    });
  }

  async findDailySummary(date: Date): Promise<DailySalesSummary[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);
    
    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    const aggregations = await this.prisma.sale.groupBy({
      by: ['storeId'],
      where: {
        timestamp: {
          gte: startOfDay,
          lte: endOfDay,
        },
      },
      _sum: {
        grandTotal: true,
      },
      _count: {
        id: true,
      },
    });

    const summaries: DailySalesSummary[] = [];
    
    for (const agg of aggregations) {
      const store = await this.prisma.store.findUnique({
        where: { id: agg.storeId },
      });

      if (store) {
        summaries.push({
          date,
          storeId: agg.storeId,
          storeCode: store.code,
          storeName: store.name,
          totalSales: agg._sum.grandTotal?.toNumber() || 0,
          totalTransactions: agg._count.id,
        });
      }
    }

    return summaries;
  }

  private toDomain(sale: any): Sale {
    return {
      id: sale.id,
      storeId: sale.storeId,
      timestamp: sale.timestamp,
      grandTotal: sale.grandTotal.toNumber(),
      syncStatus: sale.syncStatus,
      idempotencyKey: sale.idempotencyKey,
      createdAt: sale.createdAt,
      updatedAt: sale.updatedAt,
    };
  }
}
