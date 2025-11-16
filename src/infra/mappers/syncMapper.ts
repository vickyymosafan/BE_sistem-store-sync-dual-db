import { DailySalesSummary } from '../../domain/repositories/ISaleRepository';

export interface SyncResultDTO {
  success: boolean;
  count: number;
  message: string;
}

export interface DailySalesSummaryDTO {
  date: string;
  storeId: string;
  storeCode: string;
  storeName: string;
  totalSales: number;
  totalTransactions: number;
}

export function toSyncResultDTO(count: number): SyncResultDTO {
  return {
    success: true,
    count,
    message: `Berhasil menyinkronkan ${count} data`,
  };
}

export function toDailySalesSummaryDTO(summary: DailySalesSummary): DailySalesSummaryDTO {
  return {
    date: summary.date.toISOString().split('T')[0],
    storeId: summary.storeId,
    storeCode: summary.storeCode,
    storeName: summary.storeName,
    totalSales: summary.totalSales,
    totalTransactions: summary.totalTransactions,
  };
}
