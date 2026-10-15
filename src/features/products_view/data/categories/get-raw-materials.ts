'use server';

import db from '@/db';
import { productViewTable } from '@/db/schema';
import { isNotNull, asc } from 'drizzle-orm';

export async function getRawMaterials() {
  const result = await db
    .selectDistinct({ rawMaterial: productViewTable.raw_material })
    .from(productViewTable)
    .where(isNotNull(productViewTable.raw_material))
    .orderBy(asc(productViewTable.raw_material));

  return result
    .filter((r): r is { rawMaterial: string } => Boolean(r.rawMaterial))
    .map((row) => ({
      id: row.rawMaterial,
      label: row.rawMaterial
    }));
}
