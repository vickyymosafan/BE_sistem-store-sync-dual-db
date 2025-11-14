export interface Price {
  id: string;
  storeId: string;
  productId: string;
  salePrice: number;
  startDate: Date;
  endDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
}
