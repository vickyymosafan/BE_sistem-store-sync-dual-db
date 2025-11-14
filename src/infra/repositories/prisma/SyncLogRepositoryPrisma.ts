import { PrismaClient } from '@prisma/client';
import { SyncLog } from '../../../domain/entities/SyncLog';
import { ISyncLogRepository } from '../../../domain/repositories/ISyncLogRepository';

export class SyncLogRepositoryPrisma implements ISyncLogRepository {
  constructor(private prisma: PrismaClient) {}

  async create(log: Omit<SyncLog, 'id' | 'syncedAt'>): Promise<SyncLog> {
    const created = await this.prisma.syncLog.create({
      data: {
        sourceStoreId: log.sourceStoreId,
        targetStoreId: log.targetStoreId,
        notes: log.notes,
        summaryCount: log.summaryCount,
      },
    });
    return this.toDomain(created);
  }

  async findRecent(limit: number): Promise<SyncLog[]> {
    const logs = await this.prisma.syncLog.findMany({
      orderBy: { syncedAt: 'desc' },
      take: limit,
    });
    return logs.map(this.toDomain);
  }

  private toDomain(syncLog: any): SyncLog {
    return {
      id: syncLog.id,
      sourceStoreId: syncLog.sourceStoreId,
      targetStoreId: syncLog.targetStoreId,
      syncedAt: syncLog.syncedAt,
      notes: syncLog.notes,
      summaryCount: syncLog.summaryCount,
    };
  }
}
