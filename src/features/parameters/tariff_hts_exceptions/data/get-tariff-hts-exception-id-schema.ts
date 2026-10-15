import * as z from 'zod';

export const getTariffHTSExceptionID = z.object({
  id: z.coerce.number()
});

export type GetTariffHTSExceptionID = z.infer<typeof getTariffHTSExceptionID>;
