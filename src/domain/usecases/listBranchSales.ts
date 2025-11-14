import { Sale } from '../entities/Sale';
import { ISaleRepository } from '../repositories/ISaleRepository';

export async function listBranchSales(
  saleRepository: ISaleRepository,
  storeId: string,
  startDate?: Date,
  endDate?: Date
): Promise<Sale[]> {
  return await saleRepository.findByStoreAndDateRange(storeId, startDate, endDate);
}
