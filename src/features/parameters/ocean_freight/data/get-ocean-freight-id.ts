'use server';

import db from '@/db';
import { OceanFreight, oceanFreightTable } from '@/db/schema';
import {
  getOceanFreightID,
  GetOceanFreightID
} from './get-ocean-freight-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getOceanFreightId(
  input: GetOceanFreightID
): Promise<OceanFreight | null> {
  const result = getOceanFreightID.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const oceanFreight = await db
    .select()
    .from(oceanFreightTable)
    .where(eq(oceanFreightTable.id, parsedInput.id))
    .limit(1);

  return (oceanFreight[0] as OceanFreight) || null;
}
