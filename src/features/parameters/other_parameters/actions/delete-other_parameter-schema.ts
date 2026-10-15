import * as z from 'zod';

// REVISAR TIPADO
export const deleteOtherParameterSchema = z.object({
  parameter: z.string() // revisar nombre
});

export type deleteOtherParameterSchema = z.infer<
  typeof deleteOtherParameterSchema
>;
