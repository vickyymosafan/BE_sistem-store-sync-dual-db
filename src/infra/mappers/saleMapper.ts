import { Sale } from '../../domain/entities/Sale';
import { Store } from '../../domain/entities/Store';

export interface SaleDTO {
  saleId: string;
  storeId: string;
  storeCode: string;
  timestamp: string;
  grandTotal: number;
  syncStatus: string;
}

export function toSaleDTO(sale: Sale, store: Store): SaleDTO {
  return {
    saleId: sale.id,
    storeId: sale.storeId,
    storeCode: store.code,
    timestamp: sale.timestamp.toISOString(),
    grandTotal: sale.grandTotal,
    syncStatus: sale.syncStatus,
  };
}
