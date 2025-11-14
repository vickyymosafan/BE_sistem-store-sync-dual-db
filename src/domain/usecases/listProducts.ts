import { Product } from '../entities/Product';
import { IProductRepository } from '../repositories/IProductRepository';

export async function listProducts(productRepository: IProductRepository): Promise<Product[]> {
  return await productRepository.findActiveProducts();
}
