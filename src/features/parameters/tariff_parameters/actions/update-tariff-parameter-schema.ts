import { z } from 'zod';

export const updateTariffParameterSchema = z.object({
  id: z.number(),

  // PK
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),

  value: z.number(),
  cost_group: z.string().nullable().optional(),
  duty_dependent: z.boolean(),
  user: z.string().nullable().optional()
});

export type UpdateTariffParameterSchema = z.infer<
  typeof updateTariffParameterSchema
>;
