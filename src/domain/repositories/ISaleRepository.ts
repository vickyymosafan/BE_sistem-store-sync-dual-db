import { Sale, SyncStatus } from '../entities/Sale';
import { SaleItem } from '../entities/SaleItem';

export interface DailySalesSummary {
  date: Date;
  storeId: string;
  storeCode: string;
  storeName: string;
  totalSales: number;
  totalTransactions: number;
}

export interface ISaleRepository {
  findByIdempotencyKey(storeId: string, key: string): Promise<Sale | null>;
  create(
    sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'>,
    items: Omit<SaleItem, 'id' | 'saleId'>[]
  ): Promise<Sale>;
  findByStoreAndDateRange(
    storeId: string,
    startDate?: Date,
    endDate?: Date
  ): Promise<Sale[]>;
  findPendingByStoreId(storeId: string): Promise<Sale[]>;
  updateSyncStatus(saleIds: string[], status: SyncStatus): Promise<void>;
  findDailySummary(date: Date): Promise<DailySalesSummary[]>;
}
