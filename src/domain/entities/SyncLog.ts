export interface SyncLog {
  id: string;
  sourceStoreId: string;
  targetStoreId: string;
  syncedAt: Date;
  notes: string | null;
  summaryCount: number;
}
