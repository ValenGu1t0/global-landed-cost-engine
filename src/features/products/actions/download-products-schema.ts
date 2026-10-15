import * as z from 'zod';

export const downloadProductsSchema = z.object({
  columns: z.array(z.string()).optional(),
  ids: z.array(z.number()).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional()
});

export type DownloadProductsSchema = z.infer<typeof downloadProductsSchema>;
