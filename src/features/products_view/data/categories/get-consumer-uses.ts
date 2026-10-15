'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getConsumerUses() {
  const result = await db
    .selectDistinct({ consumerUse: productViewTable.consumer_use })
    .from(productViewTable)
    .where(isNotNull(productViewTable.consumer_use))
    .orderBy(asc(productViewTable.consumer_use));

  return result
    .filter((r): r is { consumerUse: string } => Boolean(r.consumerUse))
    .map((row) => ({
      id: row.consumerUse,
      label: row.consumerUse
    }));
}
