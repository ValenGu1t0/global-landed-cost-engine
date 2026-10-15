import { z } from 'zod';

export const updateDutiesCommercialAgreementSchema = z.object({
  id: z.number(),

  // PK
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),
  raw_material: z.string().min(1),

  cost_group: z.string().optional().nullable()
});

export type UpdateDutiesCommercialAgreementSchema = z.infer<
  typeof updateDutiesCommercialAgreementSchema
>;
