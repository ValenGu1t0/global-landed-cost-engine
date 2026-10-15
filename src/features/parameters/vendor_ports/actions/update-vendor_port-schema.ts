import * as z from 'zod';

export const updateVendorPortSchema = z.object({
  id: z.number().min(1),
  vendor: z.string(),
  country: z.string(),
  port: z.string(),
  main_port: z.boolean()
});

export type UpdateVendorPortSchema = z.infer<typeof updateVendorPortSchema>;
