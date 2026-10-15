import * as z from 'zod';

// REVISAR TIPADO
export const deleteVendorPortSchema = z.object({
  id: z.number() // revisar nombre
});

export type deleteVendorPortSchema = z.infer<typeof deleteVendorPortSchema>;
