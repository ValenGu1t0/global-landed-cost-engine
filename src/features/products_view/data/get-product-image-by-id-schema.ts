import { z } from 'zod';

export const getProductImagesBySkuIdSchema = z.object({
  tech_sku_id: z.number().int().positive({
    message: 'SKU ID must be a positive, unique number.'
  })
});

export type GetProductImagesBySkuIdSchema = z.infer<
  typeof getProductImagesBySkuIdSchema
>;
