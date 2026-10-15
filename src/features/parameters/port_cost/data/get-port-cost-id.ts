'use server';

import db from '@/db';
import { PortCost, portCostTable } from '@/db/schema';
import { getPortCostID, GetPortCostID } from './get-port-cost-id-schema';
import { ValidationError } from '@/lib/errors';
import { eq } from 'drizzle-orm';

export async function getPortCostById(
  input: GetPortCostID
): Promise<PortCost | null> {
  const result = getPortCostID.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;

  const portCost = await db
    .select()
    .from(portCostTable)
    .where(eq(portCostTable.id, parsedInput.id))
    .limit(1);

  return (portCost[0] as PortCost) || null;
}
