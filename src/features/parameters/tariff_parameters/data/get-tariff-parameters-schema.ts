import * as z from 'zod';

export const getTariffParametersSchema = z.object({
  page: z.number().optional(),
  limit: z.number().optional(),
  search: z.string().optional(),
  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),
  perPage: z.number().optional(),
  ids: z.array(z.number()).optional(),
  columns: z.array(z.string()).optional()
});

export type GetTariffParametersSchema = z.infer<
  typeof getTariffParametersSchema
>;
