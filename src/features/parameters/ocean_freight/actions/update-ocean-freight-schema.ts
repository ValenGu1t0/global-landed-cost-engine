import { z } from 'zod';

export const updateOceanFreightSchema = z.object({
  id: z.number(),

  // PK FIELDS
  origin_port: z.string().min(1),
  origin_country: z.string().min(1),
  destination_port: z.string().min(1),
  destination_country: z.string().min(1),
  container_type: z.string().min(1),

  value: z.number(),
  cost_group: z.string().min(1).nullable().optional()
});

export type UpdateOceanFreightSchema = z.infer<typeof updateOceanFreightSchema>;
