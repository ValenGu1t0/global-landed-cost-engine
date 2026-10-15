import * as z from 'zod';

export const getOceanFreightID = z.object({
  id: z.coerce.number()
});

export type GetOceanFreightID = z.infer<typeof getOceanFreightID>;
