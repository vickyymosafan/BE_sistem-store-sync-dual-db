import { Price } from '../entities/Price';
import { IPriceRepository } from '../repositories/IPriceRepository';

export interface CreateOrUpdatePriceInput {
  storeId: string;
  productId: string;
  salePrice: number;
  startDate: Date;
  endDate?: Date;
}

export async function createOrUpdatePrice(
  priceRepository: IPriceRepository,
  input: CreateOrUpdatePriceInput
): Promise<Price> {
  const priceData = {
    storeId: input.storeId,
    productId: input.productId,
    salePrice: input.salePrice,
    startDate: input.startDate,
    endDate: input.endDate || null,
  };

  return await priceRepository.create(priceData);
}
