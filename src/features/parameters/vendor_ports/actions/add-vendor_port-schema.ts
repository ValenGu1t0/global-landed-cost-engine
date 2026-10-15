import * as z from 'zod';

export const addVendorPortSchema = z.object({
  vendor: z.string().min(1, { message: 'Vendor is required' }),
  country: z.string().min(1, { message: 'Country is required' }),
  port: z.string().min(1, { message: 'Port is required' }),
  main_port: z.boolean()
});

export type AddVendorPortSchema = z.infer<typeof addVendorPortSchema>;
