'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getStatuses() {
  const result = await db
    .selectDistinct({ status: productViewTable.status })
    .from(productViewTable)
    .where(isNotNull(productViewTable.status))
    .orderBy(asc(productViewTable.status));

  return result
    .filter((r): r is { status: string } => Boolean(r.status))
    .map((row) => ({
      id: row.status,
      label: row.status
    }));
}
