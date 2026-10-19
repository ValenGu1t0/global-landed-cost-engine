import * as z from 'zod';

export const getProductsToDeactivateSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  ids: z.array(z.number()).optional(),
  columns: z.array(z.string()).optional(),
  cn_code: z.string().optional(),
  status: z.string().optional()
});

export type GetProductsToDeactivateSchema = z.infer<
  typeof getProductsToDeactivateSchema
>;
