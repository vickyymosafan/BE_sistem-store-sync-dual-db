import { Price } from '../entities/Price';

export interface IPriceRepository {
  findActiveByStoreId(storeId: string, date: Date): Promise<Price[]>;
  create(price: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>): Promise<Price>;
  upsertBatch(prices: Omit<Price, 'id' | 'createdAt' | 'updatedAt'>[]): Promise<number>;
}
