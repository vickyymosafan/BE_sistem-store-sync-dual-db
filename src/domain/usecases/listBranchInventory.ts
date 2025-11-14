import { Inventory } from '../entities/Inventory';
import { IInventoryRepository } from '../repositories/IInventoryRepository';

export async function listBranchInventory(
  inventoryRepository: IInventoryRepository,
  storeId: string
): Promise<Inventory[]> {
  return await inventoryRepository.findByStoreId(storeId);
}
