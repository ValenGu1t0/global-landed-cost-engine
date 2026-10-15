import * as z from 'zod';

export const deleteProductSchema = z.object({
  id: z.number()
});

export type DeleteProductSchema = z.infer<typeof deleteProductSchema>;
