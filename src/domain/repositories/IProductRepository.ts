import { Product } from '../entities/Product';

export interface IProductRepository {
  findAll(): Promise<Product[]>;
  findById(id: string): Promise<Product | null>;
  findActiveProducts(): Promise<Product[]>;
  create(data: {
    code: string;
    name: string;
    category: string;
    unit: string;
  }): Promise<Product>;
  update(
    id: string,
    data: {
      code?: string;
      name?: string;
      category?: string;
      unit?: string;
      active?: boolean;
    }
  ): Promise<Product | null>;
}
