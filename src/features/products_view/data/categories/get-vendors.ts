'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getVendors() {
  const result = await db
    .selectDistinct({ vendor: productViewTable.vendor })
    .from(productViewTable)
    .where(isNotNull(productViewTable.vendor))
    .orderBy(asc(productViewTable.vendor));

  return result
    .filter((r) => r.vendor !== '')
    .map((row) => ({
      id: row.vendor ?? '',
      label: row.vendor ?? ''
    }));
}
