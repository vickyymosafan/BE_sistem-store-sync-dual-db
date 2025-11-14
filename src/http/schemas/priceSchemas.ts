import { z } from 'zod';

export const createPriceRequestSchema = z.object({
  storeId: z.string().uuid({ message: 'Store ID must be a valid UUID' }),
  productId: z.string().uuid({ message: 'Product ID must be a valid UUID' }),
  salePrice: z.number().positive({ message: 'Sale price must be a positive number' }),
  startDate: z.string().min(1, { message: 'Start date is required' }),
  endDate: z.string().optional(),
});

export const syncPricesParamsSchema = z.object({
  storeId: z.string().uuid({ message: 'Store ID must be a valid UUID' }),
});

export type CreatePriceRequest = z.infer<typeof createPriceRequestSchema>;
export type SyncPricesParams = z.infer<typeof syncPricesParamsSchema>;
