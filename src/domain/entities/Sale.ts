export type SyncStatus = 'PENDING' | 'SYNCED';

export interface Sale {
  id: string;
  storeId: string;
  timestamp: Date;
  grandTotal: number;
  syncStatus: SyncStatus;
  idempotencyKey: string;
  createdAt: Date;
  updatedAt: Date;
}
