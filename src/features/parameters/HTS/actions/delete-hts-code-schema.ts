import * as z from 'zod';

// REVISAR TIPADO
export const deleteHTSCodeSchema = z.object({
  hts_code: z.string() // revisar nombre
});

export type deleteHTSCodeSchema = z.infer<typeof deleteHTSCodeSchema>;
