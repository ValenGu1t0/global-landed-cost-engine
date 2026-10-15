'use server';

import db from '@/db';
import { InlandParameter, inlandParametersTable } from '@/db/schema';
import {
  GetInlandParameterID,
  getInlandParameterID
} from './get-inland-parameter-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getInlandParameterId(
  input: GetInlandParameterID
): Promise<InlandParameter | null> {
  const result = getInlandParameterID.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const inland_parameter = await db
    .select()
    .from(inlandParametersTable)
    .where(eq(inlandParametersTable.id, parsedInput.id))
    .limit(1);

  return (inland_parameter[0] as InlandParameter) || null;
}
