import * as z from 'zod';

export const getIncotermCostGroupSchema = z.object({
  id: z.coerce.number()
});

export type GetIncotermCostGroupSchema = z.infer<
  typeof getIncotermCostGroupSchema
>;
