import { IPriceRepository } from '../repositories/IPriceRepository';

export interface SyncPricesToBranchInput {
  storeId: string;
}

export interface SyncResult {
  count: number;
}

export async function syncPricesToBranch(
  centralPriceRepository: IPriceRepository,
  branchPriceRepository: IPriceRepository,
  input: SyncPricesToBranchInput
): Promise<SyncResult> {
  // Read active prices from central
  const activePrices = await centralPriceRepository.findActiveByStoreId(
    input.storeId,
    new Date()
  );

  if (activePrices.length === 0) {
    return { count: 0 };
  }

  // Upsert prices to branch
  const priceData = activePrices.map((price) => ({
    storeId: price.storeId,
    productId: price.productId,
    salePrice: price.salePrice,
    startDate: price.startDate,
    endDate: price.endDate,
  }));

  const count = await branchPriceRepository.upsertBatch(priceData);

  return { count };
}
