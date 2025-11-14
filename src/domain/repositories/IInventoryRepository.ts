import { Inventory } from '../entities/Inventory';

export interface IInventoryRepository {
  findByStoreId(storeId: string): Promise<Inventory[]>;
  updateQuantity(storeId: string, productId: string, quantity: number): Promise<void>;
}
