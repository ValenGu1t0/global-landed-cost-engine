import { z } from 'zod';

export const addInlandParameterSchema = z.object({
  id: z.number().optional(),

  // PK
  inland_type: z.string().min(1),
  port: z.string().min(1),
  country: z.string().min(1),

  zip_code: z.number(),
  value: z.number(),
  cost_group: z.string().min(1)
});

export type AddInlandParameterSchema = z.infer<typeof addInlandParameterSchema>;
