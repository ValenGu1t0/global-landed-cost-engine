'use server';

import db from '@/db';
import { htsCodesTable } from '@/db/schema';
import { GetHTSCodeSchema, getHTSCodeSchema } from './get-hts-code-id-schema';
import { HTSCode } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getHTSCodeId(
  input: GetHTSCodeSchema
): Promise<HTSCode | null> {
  const result = getHTSCodeSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const htscode = await db
    .select()
    .from(htsCodesTable)
    .where(eq(htsCodesTable.hts_code, parsedInput.hts_code))
    .limit(1);

  return (htscode[0] as HTSCode) || null;
}
