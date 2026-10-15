import { z } from 'zod';

export const addPortCostSchema = z.object({
  id: z.number().optional(),

  // PK
  logistic_cost: z.string().min(1),

  value: z.number(),
  cost_group: z.string().min(1),
  user: z.string().optional()
});

export type AddPortCostSchema = z.infer<typeof addPortCostSchema>;
