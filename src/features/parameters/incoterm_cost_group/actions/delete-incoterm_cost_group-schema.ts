import * as z from 'zod';

// REVISAR TIPADO
export const deleteIncotermCostGroupSchema = z.object({
  id: z.coerce.number() // revisar nombre
});

export type deleteIncotermCostGroupSchema = z.infer<
  typeof deleteIncotermCostGroupSchema
>;
