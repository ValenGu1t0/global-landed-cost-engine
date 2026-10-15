'use server';

import db from '@/db';
import {
  TariffHTSExceptionsTable,
  tariffHTSExceptionsTable
} from '@/db/schema';
import {
  getTariffHTSExceptionID,
  GetTariffHTSExceptionID
} from './get-tariff-hts-exception-id-schema';

import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getTariffHTSExceptionId(
  input: GetTariffHTSExceptionID
): Promise<TariffHTSExceptionsTable | null> {
  const result = getTariffHTSExceptionID.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const exception = await db
    .select()
    .from(tariffHTSExceptionsTable)
    .where(eq(tariffHTSExceptionsTable.id, parsedInput.id))
    .limit(1);

  return (exception[0] as TariffHTSExceptionsTable) || null;
}
