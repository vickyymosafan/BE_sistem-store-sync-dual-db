import { Inventory } from '../../domain/entities/Inventory';
import { Product } from '../../domain/entities/Product';

export interface InventoryWithProductDTO {
  productId: string;
  productCode: string;
  productName: string;
  quantity: number;
  unit: string;
}

export function toInventoryWithProductDTO(
  inventory: Inventory,
  product: Product
): InventoryWithProductDTO {
  return {
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    quantity: inventory.quantity,
    unit: product.unit,
  };
}
