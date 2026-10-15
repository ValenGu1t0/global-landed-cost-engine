'use server';

import db from '@/db';
import {
  dutiesCommercialAgreementsTable,
  DutiesCommercialAgreements
} from '@/db/schema';
import {
  getDutiesCommercialAgreementByIdSchema,
  GetDutiesCommercialAgreementByIdSchema
} from './get-duties-commercial-agreements-by-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getDutiesCommercialAgreementById(
  input: GetDutiesCommercialAgreementByIdSchema
): Promise<DutiesCommercialAgreements | null> {
  const result = getDutiesCommercialAgreementByIdSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const duty = await db
    .select()
    .from(dutiesCommercialAgreementsTable)
    .where(eq(dutiesCommercialAgreementsTable.id, parsedInput.id))
    .limit(1);

  return (duty[0] as DutiesCommercialAgreements) || null;
}
