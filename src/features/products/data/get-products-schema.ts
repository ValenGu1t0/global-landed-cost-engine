import * as z from 'zod';

export const getProductsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  ids: z.array(z.number()).optional(),
  columns: z.array(z.string()).optional()
});

export type GetProductsSchema = z.infer<typeof getProductsSchema>;
