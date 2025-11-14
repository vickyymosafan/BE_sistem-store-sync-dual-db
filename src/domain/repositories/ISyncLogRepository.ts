import { SyncLog } from '../entities/SyncLog';

export interface ISyncLogRepository {
  create(log: Omit<SyncLog, 'id' | 'syncedAt'>): Promise<SyncLog>;
  findRecent(limit: number): Promise<SyncLog[]>;
}
