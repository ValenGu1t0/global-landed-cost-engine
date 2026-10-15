import { z } from 'zod';

export const updateGroundFreightSchema = z.object({
  id: z.number(),

  // PK
  vendor: z.string().min(1),
  factory_name: z.string().min(1),
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),
  destination_warehouse: z.string().min(1),
  container_type: z.string().min(1),

  cost_detail: z.string().optional().nullable(),
  value: z.number(),
  cost_group: z.string().min(1)
});

export type UpdateGroundFreightSchema = z.infer<
  typeof updateGroundFreightSchema
>;
