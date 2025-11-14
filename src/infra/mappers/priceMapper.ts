import { Price } from '../../domain/entities/Price';
import { Product } from '../../domain/entities/Product';

export interface PriceWithProductDTO {
  productId: string;
  productCode: string;
  productName: string;
  salePrice: number;
  unit: string;
  startDate: string;
  endDate: string | null;
}

export function toPriceWithProductDTO(price: Price, product: Product): PriceWithProductDTO {
  return {
    productId: product.id,
    productCode: product.code,
    productName: product.name,
    salePrice: price.salePrice,
    unit: product.unit,
    startDate: price.startDate.toISOString(),
    endDate: price.endDate ? price.endDate.toISOString() : null,
  };
}
