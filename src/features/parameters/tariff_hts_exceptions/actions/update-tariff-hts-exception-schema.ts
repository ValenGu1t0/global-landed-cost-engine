import { z } from 'zod';

export const updateTariffHTSExceptionSchema = z.object({
  id: z.number(),

  // PK
  hts_code: z.string().min(1),
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),

  special_tariff_value: z.number().nullable().optional(),
  cost_group: z.string().nullable().optional(),
  user: z.string().nullable().optional()
});

export type UpdateTariffHTSExceptionSchema = z.infer<
  typeof updateTariffHTSExceptionSchema
>;
