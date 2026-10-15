'use server';

import db from '@/db';
import { productTable } from '@/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';

export async function getVendorPrefix(vendor: string): Promise<string | null> {
  const result = await db
    .select({ hemicode: productTable.hemicode })
    .from(productTable)
    .where(
      and(eq(productTable.vendor, vendor), isNotNull(productTable.hemicode))
    )
    .limit(1);

  const hemicode = result[0]?.hemicode;

  if (!hemicode) {
    return null;
  }

  return hemicode.split('-')[0];
}
