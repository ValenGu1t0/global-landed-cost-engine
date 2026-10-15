import * as z from 'zod';

export const bulkActivateStatusSchema = z.object({
  tech_sku_id: z
    .array(z.number())
    .min(1, 'At least one product must be selected')
});

export type BulkActivateStatusSchema = z.infer<typeof bulkActivateStatusSchema>;
