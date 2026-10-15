import { z } from 'zod';

export const addTariffHTSExceptionSchema = z.object({
  id: z.number().optional(),

  // PK
  hts_code: z.string().min(1),
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),

  special_tariff_value: z.number(),
  cost_group: z.string().min(1),
  user: z.string().optional()
});

export type AddTariffHTSExceptionSchema = z.infer<
  typeof addTariffHTSExceptionSchema
>;
