import { z } from 'zod';

export const updateInlandParameterSchema = z.object({
  id: z.number(),

  // PK
  inland_type: z.string(),
  port: z.string(),
  country: z.string(),

  zip_code: z.number().int().nonnegative(),
  value: z.number(),
  cost_group: z.string()
});

export type UpdateInlandParameterSchema = z.infer<
  typeof updateInlandParameterSchema
>;
