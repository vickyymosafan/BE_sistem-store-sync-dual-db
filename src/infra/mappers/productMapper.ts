import { Product } from '../../domain/entities/Product';

export interface ProductDTO {
  id: string;
  code: string;
  name: string;
  category: string;
  unit: string;
  active: boolean;
}

export function toProductDTO(product: Product): ProductDTO {
  return {
    id: product.id,
    code: product.code,
    name: product.name,
    category: product.category,
    unit: product.unit,
    active: product.active,
  };
}
