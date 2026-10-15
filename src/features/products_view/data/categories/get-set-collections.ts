'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getSetCollections() {
  const result = await db
    .selectDistinct({ setCollection: productViewTable.set_collection })
    .from(productViewTable)
    .where(isNotNull(productViewTable.set_collection))
    .orderBy(asc(productViewTable.set_collection));

  return result
    .filter((r): r is { setCollection: string } => Boolean(r.setCollection))
    .map((row) => ({
      id: row.setCollection,
      label: row.setCollection
    }));
}
