import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export async function createProduct(
  repository: IProductRepository,
  data: {
    code: string;
    name: string;
    category: string;
    unit: string;
  }
): Promise<Product> {
  return repository.create(data);
}
