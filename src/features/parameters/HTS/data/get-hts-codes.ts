'use server';

import db from '@/db';
import { htsCodesTable } from '@/db/schema';
import { GetHTSCodesSchema, getHTSCodesSchema } from './get-hts-codes-schema';
import { HTSCode } from '@/db/schema';
import { ValidationError } from '@/lib/errors';
import { and, or, asc, desc, SQL, count, sql } from 'drizzle-orm';

export async function getHTSCodes(input: GetHTSCodesSchema): Promise<{
  htscodes: HTSCode[];
  totalCount: number;
}> {
  const result = getHTSCodesSchema.safeParse(input);

  if (!result.success) {
    throw new ValidationError(JSON.stringify(result.error));
  }

  const parsedInput = result.data;
  const page = parsedInput.page || 1;
  const limit = parsedInput.limit || 10;
  const offset = (page - 1) * limit;

  const conditions = [];

  if (parsedInput.search) {
    const search = parsedInput.search.toLowerCase();
    const s = `%${search}%`;

    conditions.push(
      or(
        sql`LOWER(${htsCodesTable.hts_code}) LIKE ${s}`,
        sql`LOWER(${htsCodesTable.hts_category}) LIKE ${s}`,
        sql`LOWER(${htsCodesTable.hts_product_subtype}) LIKE ${s}`,
        sql`LOWER(${htsCodesTable.type}) LIKE ${s}`,
        sql`LOWER(${htsCodesTable.cost_group}) LIKE ${s}`,
        sql`LOWER(${htsCodesTable.notes}) LIKE ${s}`
      )
    );
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  const orderByClause: SQL[] = [];

  if (parsedInput.sortBy) {
    const columnMap: Record<string, any> = {
      id: htsCodesTable.hts_code,
      hts_category: htsCodesTable.hts_category,
      hts_product_subtype: htsCodesTable.hts_product_subtype
    };

    const column = columnMap[parsedInput.sortBy];
    if (column) {
      const isDesc = parsedInput.sortDirection === 'desc';
      orderByClause.push(isDesc ? desc(column) : asc(column));
    }
  }

  const filteredHTSCodes = await db
    .select()
    .from(htsCodesTable)
    .where(and(whereClause))
    .orderBy(
      ...(orderByClause.length > 0
        ? orderByClause
        : [asc(htsCodesTable.hts_code)])
    )
    .limit(limit)
    .offset(offset);

  const [{ count: totalCount }] = await db
    .select({ count: count() })
    .from(htsCodesTable)
    .where(and(whereClause));

  return {
    htscodes: filteredHTSCodes as HTSCode[],
    totalCount
  };
}
