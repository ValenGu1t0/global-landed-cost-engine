'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getCategories() {
  const result = await db
    .selectDistinct({ category: productViewTable.category })
    .from(productViewTable)
    .where(isNotNull(productViewTable.category))
    .orderBy(asc(productViewTable.category));

  return result
    .filter((r): r is { category: string } => Boolean(r.category))
    .map((row) => ({
      id: row.category,
      label: row.category
    }));
}
