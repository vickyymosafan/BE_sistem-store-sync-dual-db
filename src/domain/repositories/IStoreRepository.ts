import { Store } from '../entities/Store';

export interface IStoreRepository {
  findAll(): Promise<Store[]>;
  findById(id: string): Promise<Store | null>;
  findByCode(code: string): Promise<Store | null>;
}
