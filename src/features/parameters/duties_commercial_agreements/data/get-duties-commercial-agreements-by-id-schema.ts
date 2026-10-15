import { z } from 'zod';

export const getDutiesCommercialAgreementByIdSchema = z.object({
  id: z.number()
});

export type GetDutiesCommercialAgreementByIdSchema = z.infer<
  typeof getDutiesCommercialAgreementByIdSchema
>;
