import { z } from 'zod';

export const storeIdParamSchema = z.object({
  storeId: z.string().uuid({ message: 'Store ID must be a valid UUID' }),
});

export type StoreIdParam = z.infer<typeof storeIdParamSchema>;
