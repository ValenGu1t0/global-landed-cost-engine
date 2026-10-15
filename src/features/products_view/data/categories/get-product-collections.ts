'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getProductCollections() {
  const result = await db
    .selectDistinct({ collection: productViewTable.product_collection })
    .from(productViewTable)
    .where(isNotNull(productViewTable.product_collection))
    .orderBy(asc(productViewTable.product_collection));

  return result
    .filter((r): r is { collection: string } => Boolean(r.collection))
    .map((row) => ({
      id: row.collection,
      label: row.collection
    }));
}
