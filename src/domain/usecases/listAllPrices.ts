import { Price } from '../entities/Price';
import { IPriceRepository } from '../repositories/IPriceRepository';

export async function listAllPrices(
  priceRepository: IPriceRepository,
  storeId: string
): Promise<Price[]> {
  return await priceRepository.findAllByStoreId(storeId);
}
