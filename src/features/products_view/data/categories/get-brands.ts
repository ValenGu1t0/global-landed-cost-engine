'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getBrands() {
  const result = await db
    .selectDistinct({ brand: productViewTable.brand_name })
    .from(productViewTable)
    .where(isNotNull(productViewTable.brand_name))
    .orderBy(asc(productViewTable.brand_name));

  return result
    .filter((r): r is { brand: string } => Boolean(r.brand))
    .map((row) => ({
      id: row.brand,
      label: row.brand
    }));
}
