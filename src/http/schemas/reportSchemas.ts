import { z } from 'zod';

export const dailySalesQuerySchema = z.object({
  date: z.string().min(1, { message: 'Date is required' }),
});

export type DailySalesQuery = z.infer<typeof dailySalesQuerySchema>;
