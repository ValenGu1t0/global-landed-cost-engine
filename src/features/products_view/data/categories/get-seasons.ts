'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getSeasons() {
  const result = await db
    .selectDistinct({ season: productViewTable.season })
    .from(productViewTable)
    .where(isNotNull(productViewTable.season))
    .orderBy(asc(productViewTable.season));

  return result
    .filter((r): r is { season: string } => Boolean(r.season))
    .map((row) => ({
      id: row.season,
      label: row.season
    }));
}
