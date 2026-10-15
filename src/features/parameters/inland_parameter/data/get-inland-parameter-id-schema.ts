import * as z from 'zod';

export const getInlandParameterID = z.object({
  id: z.coerce.number()
});

export type GetInlandParameterID = z.infer<typeof getInlandParameterID>;
