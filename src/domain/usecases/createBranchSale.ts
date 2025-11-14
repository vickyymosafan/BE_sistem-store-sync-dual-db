import { Sale } from '../entities/Sale';
import { SaleItem } from '../entities/SaleItem';
import { ISaleRepository } from '../repositories/ISaleRepository';

export interface CreateBranchSaleInput {
  storeId: string;
  idempotencyKey: string;
  items: Array<{
    productId: string;
    quantity: number;
    unitPrice: number;
  }>;
}

export async function createBranchSale(
  saleRepository: ISaleRepository,
  input: CreateBranchSaleInput
): Promise<Sale> {
  // Check idempotency
  const existingSale = await saleRepository.findByIdempotencyKey(
    input.storeId,
    input.idempotencyKey
  );

  if (existingSale) {
    return existingSale;
  }

  // Calculate totals
  const items: Omit<SaleItem, 'id' | 'saleId'>[] = input.items.map((item) => ({
    productId: item.productId,
    quantity: item.quantity,
    unitPrice: item.unitPrice,
    subtotal: item.quantity * item.unitPrice,
  }));

  const grandTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  // Create sale
  const sale: Omit<Sale, 'id' | 'createdAt' | 'updatedAt'> = {
    storeId: input.storeId,
    timestamp: new Date(),
    grandTotal,
    syncStatus: 'PENDING',
    idempotencyKey: input.idempotencyKey,
  };

  return await saleRepository.create(sale, items);
}
