import * as z from 'zod';

export const addIncotermCostGroupSchema = z.object({
  cost_group: z.string().min(1),
  vendor: z.string().min(1),
  country: z.string().min(1),
  incoterm: z.string().min(1)
});

export type AddIncotermCostGroupSchema = z.infer<
  typeof addIncotermCostGroupSchema
>;
