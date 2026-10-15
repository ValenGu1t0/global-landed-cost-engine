import * as z from 'zod';

export const getVendorPortsSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional()
});

export type GetVendorPortsSchema = z.infer<typeof getVendorPortsSchema>;
// atento al codes en plural
