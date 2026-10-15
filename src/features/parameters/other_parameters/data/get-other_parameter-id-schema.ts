import * as z from 'zod';

export const getOtherParameterSchema = z.object({
  parameter: z.string()
});

export type GetOtherParameterSchema = z.infer<typeof getOtherParameterSchema>;
