import * as z from 'zod';

export const getPortCostID = z.object({
  id: z.coerce.number()
});

export type GetPortCostID = z.infer<typeof getPortCostID>;
