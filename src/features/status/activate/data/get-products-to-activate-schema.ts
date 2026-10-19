import * as z from 'zod';

export const getProductsToActivateSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  ids: z.array(z.number()).optional(),
  columns: z.array(z.string()).optional(),
  cn_code: z.string().optional(),
  status: z.array(z.enum(['INACTIVE', 'PROJECT', 'GS'])).optional()
});

export type GetProductsToActivateSchema = z.infer<
  typeof getProductsToActivateSchema
>;
