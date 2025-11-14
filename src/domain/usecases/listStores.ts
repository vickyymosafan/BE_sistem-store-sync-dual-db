import { Store } from '../entities/Store';
import { IStoreRepository } from '../repositories/IStoreRepository';

export async function listStores(storeRepository: IStoreRepository): Promise<Store[]> {
  return await storeRepository.findAll();
}
