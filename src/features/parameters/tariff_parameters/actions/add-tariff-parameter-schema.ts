import { z } from 'zod';

export const addTariffParametersSchema = z.object({
  id: z.number().optional(),

  // PK
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),

  value: z.number().optional(),
  cost_group: z.string().optional(),
  duty_dependent: z.boolean().optional().default(false)
});

export type AddTariffParametersSchema = z.infer<
  typeof addTariffParametersSchema
>;
