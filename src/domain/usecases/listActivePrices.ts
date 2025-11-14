import { Price } from '../entities/Price';
import { IPriceRepository } from '../repositories/IPriceRepository';

export async function listActivePrices(
  priceRepository: IPriceRepository,
  storeId: string,
  date: Date = new Date()
): Promise<Price[]> {
  return await priceRepository.findActiveByStoreId(storeId, date);
}
