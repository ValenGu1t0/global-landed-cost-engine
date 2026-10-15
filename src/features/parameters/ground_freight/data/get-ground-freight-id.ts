'use server';

import db from '@/db';
import { GroundFreight, groundFreightTable } from '@/db/schema';
import {
  getGroundFreightID,
  GetGroundFreightID
} from './get-ground-freight-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getGroundFreightId(
  input: GetGroundFreightID
): Promise<GroundFreight | null> {
  const result = getGroundFreightID.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const groundFreight = await db
    .select()
    .from(groundFreightTable)
    .where(eq(groundFreightTable.id, parsedInput.id))
    .limit(1);

  return (groundFreight[0] as GroundFreight) || null;
}
