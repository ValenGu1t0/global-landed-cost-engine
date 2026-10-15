import * as z from 'zod';

export const getTariffParameterID = z.object({
  id: z.coerce.number()
});

export type GetTariffParameterID = z.infer<typeof getTariffParameterID>;
