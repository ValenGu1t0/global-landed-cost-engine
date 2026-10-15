'use server';

import db from '@/db';
import { TariffParameters, tariffParametersTable } from '@/db/schema';
import {
  getTariffParameterID,
  GetTariffParameterID
} from './get-tariff-parameter-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getTariffParameterId(
  input: GetTariffParameterID
): Promise<TariffParameters | null> {
  const result = getTariffParameterID.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const tariff = await db
    .select()
    .from(tariffParametersTable)
    .where(eq(tariffParametersTable.id, parsedInput.id))
    .limit(1);

  return (tariff[0] as TariffParameters) || null;
}
