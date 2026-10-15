'use server';

import db from '@/db';
import { incotermCostGroupTable } from '@/db/schema';
import {
  GetIncotermCostGroupSchema,
  getIncotermCostGroupSchema
} from './get-incoterm_cost_group-id-schema';
import { IncotermCostGroup } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getIncotermCostGroupId(
  input: GetIncotermCostGroupSchema
): Promise<IncotermCostGroup | null> {
  const result = getIncotermCostGroupSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const incotermCostGroup = await db
    .select()
    .from(incotermCostGroupTable)
    .where(eq(incotermCostGroupTable.id, parsedInput.id))
    .limit(1);

  return (incotermCostGroup[0] as IncotermCostGroup) || null;
}
