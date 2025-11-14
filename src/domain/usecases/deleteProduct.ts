import { IProductRepository } from '../repositories/IProductRepository';

export async function deleteProduct(
  repository: IProductRepository,
  id: string
): Promise<boolean> {
  return repository.delete(id);
}
