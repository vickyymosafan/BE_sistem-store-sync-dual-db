import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export async function updateProduct(
  repository: IProductRepository,
  id: string,
  data: {
    code?: string;
    name?: string;
    category?: string;
    unit?: string;
    active?: boolean;
  }
): Promise<Product | null> {
  return repository.update(id, data);
}
