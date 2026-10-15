import * as z from 'zod';

export const addOtherParameterSchema = z.object({
  parameter: z.string().min(1, { message: 'Parameter is required.' }),
  value: z.number().min(0.0),
  cost_group: z.string().min(1)
});

export type AddOtherParameterSchema = z.infer<typeof addOtherParameterSchema>;
