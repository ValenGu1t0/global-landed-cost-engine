import { z } from 'zod';

export const addDutiesCommercialAgreementSchema = z.object({
  id: z.number().optional(),

  // PK lógica
  origin_country: z.string().min(1),
  destination_country: z.string().min(1),
  raw_material: z.string().min(1),

  cost_group: z.string().optional().nullable()
});

export type AddDutiesCommercialAgreementSchema = z.infer<
  typeof addDutiesCommercialAgreementSchema
>;
