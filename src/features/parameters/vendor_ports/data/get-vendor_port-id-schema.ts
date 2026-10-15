import * as z from 'zod';

export const getVendorPortSchema = z.object({
  id: z.number()
});

export type GetVendorPortSchema = z.infer<typeof getVendorPortSchema>;
