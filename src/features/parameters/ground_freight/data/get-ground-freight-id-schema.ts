import * as z from 'zod';

export const getGroundFreightID = z.object({
  id: z.coerce.number()
});

export type GetGroundFreightID = z.infer<typeof getGroundFreightID>;
