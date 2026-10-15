import * as z from 'zod';

export const getProductsViewSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  ids: z.array(z.number()).optional(),
  columns: z.array(z.string()).optional(),

  stock: z.union([z.boolean(), z.string()]).optional(),
  type: z.string().optional(),
  vendor: z.string().optional(),
  brand_name: z.string().optional(),
  category: z.string().optional(),
  consumer_use: z.string().optional(),
  product_collection: z.string().optional(),
  raw_material: z.string().optional(),
  season: z.string().optional(),
  set_collection: z.string().optional(),
  status: z.string().optional()
});

export type GetProductsViewSchema = z.infer<typeof getProductsViewSchema>;
