import * as z from 'zod';

export const getProductByIdSchema = z.object({
  tech_sku_id: z.number()
});

export type GetProductByIdSchema = z.infer<typeof getProductByIdSchema>;
