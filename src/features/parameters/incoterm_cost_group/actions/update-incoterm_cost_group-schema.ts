import * as z from 'zod';

export const updateIncotermCostGroupSchema = z.object({
  id: z.coerce.number().min(1),
  cost_group: z.string(),
  vendor: z.string(),
  country: z.string(),
  incoterm: z.string()
});

export type UpdateIncotermCostGroupSchema = z.infer<
  typeof updateIncotermCostGroupSchema
>;
