import { z } from 'zod';

export const updatePortCostSchema = z.object({
  id: z.number(),

  // PK FIELD
  logistic_cost: z.string().min(1),

  value: z.number(),
  cost_group: z.string().nullable().optional(),
  user: z.string().nullable().optional()
});

export type UpdatePortCostSchema = z.infer<typeof updatePortCostSchema>;
