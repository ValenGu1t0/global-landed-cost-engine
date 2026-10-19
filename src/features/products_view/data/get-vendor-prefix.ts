'use server';

import db from '@/db';
import { productTable } from '@/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';

export async function getVendorPrefix(vendor: string): Promise<string | null> {
  const result = await db
    .select({ cn_code: productTable.cn_code })
    .from(productTable)
    .where(
      and(eq(productTable.vendor, vendor), isNotNull(productTable.cn_code))
    )
    .limit(1);

  const cn_code = result[0]?.cn_code;

  if (!cn_code) {
    return null;
  }

  return cn_code.split('-')[0];
}
