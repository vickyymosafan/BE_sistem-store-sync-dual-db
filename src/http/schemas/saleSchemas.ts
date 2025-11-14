import { z } from 'zod';

export const createSaleRequestSchema = z.object({
  idempotencyKey: z.string().min(1, { message: 'Idempotency key is required' }),
  items: z
    .array(
      z.object({
        productId: z.string().uuid({ message: 'Product ID must be a valid UUID' }),
        quantity: z.number().int().positive({ message: 'Quantity must be a positive integer' }),
        unitPrice: z.number().positive({ message: 'Unit price must be a positive number' }),
      })
    )
    .min(1, { message: 'At least one item is required' }),
});

export const listSalesQuerySchema = z.object({
  startDate: z.string().optional(),
  endDate: z.string().optional(),
});

export type CreateSaleRequest = z.infer<typeof createSaleRequestSchema>;
export type ListSalesQuery = z.infer<typeof listSalesQuerySchema>;
