import * as z from 'zod';

export const updateHTSCodeSchema = z.object({
  hts_code: z.string().min(1, { message: 'HTS Code is required.' }),
  hts_category: z.string(),
  min_value: z.number(),
  max_value: z.number(),
  type: z.string(),
  duty: z.number(),
  cost_group: z.string(),
  hts_product_subtype: z.string(),
  fixed_duty_per_piece: z.number(),
  notes: z.string()
});

export type UpdateHTSCodeSchema = z.infer<typeof updateHTSCodeSchema>;
