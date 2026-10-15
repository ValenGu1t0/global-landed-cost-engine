import * as z from 'zod';

export const bulkDeactivateStatusSchema = z.object({
  tech_sku_id: z
    .array(z.number())
    .min(1, 'At least one product must be selected'),
  status: z.enum(['ACTIVE', 'INACTIVE', 'PROJECT', 'GLOBAL SOURCING'])
});

export type BulkDeactivateStatusSchema = z.infer<
  typeof bulkDeactivateStatusSchema
>;
