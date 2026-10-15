'use server';

import db from '@/db';
import { otherParametersTable } from '@/db/schema';
import {
  GetOtherParameterSchema,
  getOtherParameterSchema
} from './get-other_parameter-id-schema';
import { OtherParameter } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getOtherParameterId(
  input: GetOtherParameterSchema
): Promise<OtherParameter | null> {
  const result = getOtherParameterSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const otherParameter = await db
    .select()
    .from(otherParametersTable)
    .where(eq(otherParametersTable.parameter, parsedInput.parameter))
    .limit(1);

  return (otherParameter[0] as OtherParameter) || null;
}
