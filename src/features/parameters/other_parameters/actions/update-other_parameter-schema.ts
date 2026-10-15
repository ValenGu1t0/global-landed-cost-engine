import * as z from 'zod';

export const updateOtherParameterSchema = z.object({
  parameter: z.string().min(1, { message: 'Parameter field is required.' }),
  value: z.number(),
  cost_group: z.string()
});

export type UpdateOtherParameterSchema = z.infer<
  typeof updateOtherParameterSchema
>;
