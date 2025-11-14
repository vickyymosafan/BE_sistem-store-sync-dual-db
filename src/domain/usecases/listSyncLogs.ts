import { SyncLog } from '../entities/SyncLog';
import { ISyncLogRepository } from '../repositories/ISyncLogRepository';

export async function listSyncLogs(
  repository: ISyncLogRepository,
  limit: number = 50
): Promise<SyncLog[]> {
  return repository.findRecent(limit);
}
