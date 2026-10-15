import * as z from 'zod';

export const getDutiesCommercialAgreementsSchema = z.object({
  page: z.number().optional(),
  perPage: z.number().optional(),

  // Input de busqueda
  search: z.string().optional(),

  sortBy: z.string().optional(),
  sortDirection: z.enum(['asc', 'desc']).optional(),

  ids: z.array(z.number()).optional(),
  columns: z.array(z.string()).optional()
});

export type GetDutiesCommercialAgreementsSchema = z.infer<
  typeof getDutiesCommercialAgreementsSchema
>;
